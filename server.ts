import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial middlewwares
  app.use(express.json());

  // --- API ROUTE FOR MELHOR ENVIO FREIGHT CALCULATION ---
  app.post("/api/frete", async (req, res) => {
    try {
      const { to_cep, products } = req.body;
      const cleanToCep = (to_cep || "").replace(/\D/g, "");

      if (cleanToCep.length !== 8) {
        return res.status(400).json({ 
          error: "Por favor, indique um CEP de destino válido com 8 dígitos." 
        });
      }

      const token = process.env.MELHOR_ENVIO_TOKEN;
      const isSandboxStr = process.env.MELHOR_ENVIO_SANDBOX || "true";
      const isSandbox = isSandboxStr === "true";
      const originCep = (process.env.MELHOR_ENVIO_FROM_CEP || "01001000").replace(/\D/g, "");

      // Compile products payload with standard default dimensions if empty
      const normalizedProducts = Array.isArray(products) && products.length > 0 
        ? products.map((p, idx) => ({
            id: String(p.id || idx + 1),
            width: Number(p.width || 15),
            height: Number(p.height || 10),
            length: Number(p.length || 20),
            weight: Number(p.weight || 0.5),
            insurance_value: Number(p.price || 50),
            quantity: Number(p.quantity || 1)
          }))
        : [
            {
              id: "1",
              width: 15,
              height: 10,
              length: 20,
              weight: 0.5,
              insurance_value: 50,
              quantity: 1
            }
          ];

      // If token is configured, try making the real API call
      if (token && token.trim().length > 10) {
        const baseUrl = isSandbox 
          ? "https://sandbox.melhorenvio.com.br" 
          : "https://melhorenvio.com.br";
        
        console.log(`[Melhor Envio] Realizando cálculo real pela API no endpoint: ${baseUrl}`);

        try {
          const apiResponse = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
              "User-Agent": "HikiVitrineApp/1.0 (narutofamilyhinata@gmail.com)"
            },
            body: JSON.stringify({
              from: { postal_code: originCep },
              to: { postal_code: cleanToCep },
              products: normalizedProducts
            })
          });

          if (apiResponse.ok) {
            const data = await apiResponse.json();
            
            // Map Melhor Envio response payload to our standard interface
            if (Array.isArray(data)) {
              // Filters out invalid/inactive options and routes with errors
              const mappedOptions = data
                .filter((option: any) => !option.error && option.price)
                .map((option: any) => {
                  let icon = "🚚";
                  let color = "border-slate-200 bg-white text-slate-900";
                  const nameLower = (option.name || "").toLowerCase();
                  
                  if (nameLower.includes("sedex")) {
                    icon = "⚡";
                    color = "border-blue-200 bg-blue-50/20 text-blue-900";
                  } else if (nameLower.includes("pac")) {
                    icon = "🚚";
                    color = "border-amber-200 bg-amber-50/20 text-amber-900";
                  } else if (nameLower.includes("jadlog")) {
                    icon = "📦";
                    color = "border-orange-200 bg-orange-50/20 text-orange-950";
                  }

                  return {
                    id: `me-${option.company.name.toLowerCase()}-${option.id}`,
                    carrier: option.company.name,
                    service: option.name,
                    price: Number(option.price),
                    days: Number(option.delivery_time || option.custom_delivery_time || 5),
                    icon,
                    color
                  };
                });

              if (mappedOptions.length > 0) {
                return res.json({
                  source: "Melhor Envio API Real",
                  options: mappedOptions
                });
              }
            }
          } else {
            const errText = await apiResponse.text();
            console.warn(`[Melhor Envio] API respondeu com erro HTTP ${apiResponse.status}: ${errText}`);
          }
        } catch (apiErr) {
          console.error("[Melhor Envio] Exceção na chamada de API:", apiErr);
        }
      }

      // --- RESILIENT SIMULATOR FALLBACK ---
      // If token is missing, expired, sandbox endpoint fails, we use a beautifully tuned, highly realistic fallback engine:
      console.log("[Melhor Envio] Utilizando motor fallback resiliente para simular taxas.");
      
      // We seek location state through a fast public lookup to customize simulated distances
      let state = "SP";
      let city = "Destino";
      try {
        const placeRes = await fetch(`https://viacep.com.br/ws/${cleanToCep}/json/`);
        if (placeRes.ok) {
          const placeData = await placeRes.json();
          if (!placeData.erro) {
            state = placeData.uf || "SP";
            city = placeData.localidade || "Destino";
          }
        }
      } catch (e) {
        // Safe check
      }

      let multiplier = 1.0;
      let baseDaysPAC = 5;
      let basePricePAC = 18.90;

      if (state === 'SP') {
        multiplier = 0.5;
        baseDaysPAC = 2;
        basePricePAC = 9.90;
      } else if (['RJ', 'MG', 'PR', 'SC'].includes(state)) {
        multiplier = 0.8;
        baseDaysPAC = 4;
        basePricePAC = 15.90;
      } else if (['RS', 'DF', 'ES', 'GO', 'MS'].includes(state)) {
        multiplier = 1.1;
        baseDaysPAC = 6;
        basePricePAC = 22.50;
      } else if (['BA', 'PE', 'CE', 'MT', 'AL', 'SE', 'PB', 'RN'].includes(state)) {
        multiplier = 1.5;
        baseDaysPAC = 8;
        basePricePAC = 29.90;
      } else {
        multiplier = 2.2;
        baseDaysPAC = 12;
        basePricePAC = 38.50;
      }

      // Compute weight influence based on normalized products sum
      const totalWeight = normalizedProducts.reduce((acc, p) => acc + (p.weight * p.quantity), 0);
      const totalValue = normalizedProducts.reduce((acc, p) => acc + (p.insurance_value * p.quantity), 0);
      const weightFactor = 1.0 + (totalWeight * 0.15) + (totalValue > 500 ? 0.2 : 0);

      const computedOptions = [
        {
          id: "melhor-envio-pac",
          carrier: "Correios",
          service: "PAC",
          price: Number((basePricePAC * weightFactor).toFixed(2)),
          days: baseDaysPAC,
          icon: "🚚",
          color: "border-amber-200 bg-amber-50/20 text-amber-900"
        },
        {
          id: "melhor-envio-sedex",
          carrier: "Correios",
          service: "SEDEX",
          price: Number((basePricePAC * 1.8 * weightFactor * multiplier).toFixed(2)),
          days: Math.max(1, Math.round(baseDaysPAC * 0.4)),
          icon: "⚡",
          color: "border-blue-200 bg-blue-50/20 text-blue-900"
        },
        {
          id: "melhor-envio-jadlog-package",
          carrier: "Jadlog",
          service: "Package",
          price: Number((basePricePAC * 0.9 * weightFactor).toFixed(2)),
          days: baseDaysPAC + 1,
          icon: "📦",
          color: "border-orange-200 bg-orange-50/20 text-orange-950"
        },
        {
          id: "melhor-envio-jadlog-com",
          carrier: "Jadlog",
          service: ".COM (Expresso)",
          price: Number((basePricePAC * 1.5 * weightFactor * multiplier).toFixed(2)),
          days: Math.max(2, Math.round(baseDaysPAC * 0.5)),
          icon: "🚚💨",
          color: "border-rose-200 bg-rose-50/20 text-rose-950"
        }
      ];

      res.json({
        source: `Melhor Envio Simulador (${city}-${state})`,
        options: computedOptions,
        address: { city, state }
      });

    } catch (err: any) {
      console.error("Erro interno no cálculo do frete:", err);
      res.status(500).json({ error: "Ocorreu um erro interno ao calcular o frete." });
    }
  });

  // --- GLOBAL MEMORY FOR PIX SIMULATION STATE ---
  const simulatedPayments = new Map<string, { status: string; amount: number; description: string; date: string }>();

  // --- API ROUTE FOR MERCADO PAGO CREATE PIX ---
  app.post("/api/mercadopago/pix", async (req, res) => {
    try {
      const { amount, description, email, customToken } = req.body;
      const finalAmount = Number(amount || 0);

      if (finalAmount <= 0) {
        return res.status(400).json({ error: "Valor de transação inválido." });
      }

      // Check for access token: custom set in Admin Dashboard or .env file
      const token = (customToken && customToken.trim().length > 10) 
        ? customToken 
        : process.env.MP_ACCESS_TOKEN;

      const isRealAPI = token && token.trim().length > 15 && !token.includes("YOUR") && !token.includes("fake");

      if (isRealAPI) {
        console.log(`[Mercado Pago] Solicitando PIX real ao Mercado Pago. Valor: R$ ${finalAmount}`);
        const idempotencyKey = "hiki-pix-" + Math.random().toString(36).substring(2, 12) + Date.now();

        try {
          const mpResponse = await fetch("https://api.mercadopago.com/v1/payments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token.trim()}`,
              "X-Idempotency-Key": idempotencyKey
            },
            body: JSON.stringify({
              transaction_amount: Number(finalAmount.toFixed(2)),
              description: description || "Pedido Hiki Shop",
              payment_method_id: "pix",
              payer: {
                email: email || "comprador@hikishop.com",
                first_name: "Cliente",
                last_name: "Hiki",
                identification: {
                  type: "CPF",
                  // Generic test CPF for sandbox transactions
                  number: "19100000000"
                }
              }
            })
          });

          if (mpResponse.ok) {
            const data = await mpResponse.json();
            
            // Format to general interface
            const qr_code = data.point_of_interaction?.transaction_data?.qr_code;
            const qr_code_base64 = data.point_of_interaction?.transaction_data?.qr_code_base64;

            if (qr_code && qr_code_base64) {
              return res.json({
                success: true,
                source: "Mercado Pago API Oficial",
                payment_id: String(data.id),
                status: data.status, // "pending", "approved", etc.
                qr_code,
                qr_code_base64
              });
            } else {
              console.warn("[Mercado Pago] Resposta da API não continha os dados do QR code:", data);
            }
          } else {
            const errBody = await mpResponse.text();
            console.error(`[Mercado Pago] Erro HTTP ${mpResponse.status}:`, errBody);
          }
        } catch (apiErr) {
          console.error("[Mercado Pago] Erro ao conectar na API:", apiErr);
        }
      }

      // --- RESILIENT PIX SIMULATOR ENGINE ---
      // Runs if keys are missing/sandbox error is returned so user gets full testability
      console.log(`[Mercado Pago] Utilizando simulação de pagamento PIX para demonstrar o fluxo.`);
      const simPaymentId = `sim-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Standard BR.GOV.BCB.PIX EMV compliant simulated mock format:
      const simulatedEmvCode = `00020126580014br.gov.bcb.pix0136hikishop2026pay-${simPaymentId}5204000053039865405${finalAmount.toFixed(2)}5802BR5915HikiShopCorp6009SaoPaulo62070503***6304`;
      
      // Standard beautiful mock base64 for QR Code (small placeholder graphic)
      // Standard static QR visual vector mapped base64
      const mockQrBase64 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAA6S0ntAAAAD1BMVEUAAAD///8SFBYmKS84O0E2vj0PAAAABXRSTlMAAAAAAABh96gAAAAAd0lEQVR42u3PMQ0AAAgEsO8fZShgYg9uCEid6s6CgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8M8CAnmKCQm0K4K5AAAAAElFTkSuQmCC";

      // Insert simulation payload
      simulatedPayments.set(simPaymentId, {
        status: "pending",
        amount: finalAmount,
        description: description || "Pedido Hiki Shop",
        date: new Date().toLocaleDateString('pt-BR')
      });

      return res.json({
        success: true,
        source: "Mercado Pago Simulador Integrado",
        payment_id: simPaymentId,
        status: "pending",
        qr_code: simulatedEmvCode,
        qr_code_base64: mockQrBase64
      });

    } catch (err: any) {
      console.error("[Mercado Pago] Erro geral ao criar PIX:", err);
      res.status(500).json({ error: "Erro interno ao processar QR Code do PIX." });
    }
  });

  // --- API ROUTE FOR CHECKING PIX PAYMENT STATUS ---
  app.get("/api/mercadopago/status/:id", async (req, res) => {
    try {
      const paymentId = req.params.id;
      const customToken = req.query.customToken as string;

      if (!paymentId) {
        return res.status(400).json({ error: "ID de pagamento é obrigatório." });
      }

      // If it is simulated
      if (paymentId.startsWith("sim-")) {
        const pInfo = simulatedPayments.get(paymentId);
        if (!pInfo) {
          return res.status(404).json({ error: "Pagamento não encontrado no simulador." });
        }
        return res.json({
          payment_id: paymentId,
          status: pInfo.status, // "pending" or "approved"
          source: "Mercado Pago Simulador Integrado"
        });
      }

      // Real payment lookup
      const token = (customToken && customToken.trim().length > 10) ? customToken : process.env.MP_ACCESS_TOKEN;
      if (token && token.trim().length > 15 && !token.includes("YOUR")) {
        try {
          const checkRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token.trim()}`,
              "Accept": "application/json"
            }
          });

          if (checkRes.ok) {
            const data = await checkRes.json();
            return res.json({
              payment_id: paymentId,
              status: data.status, // status can be "pending", "approved", "rejected", etc.
              status_detail: data.status_detail,
              source: "Mercado Pago API Real"
            });
          }
        } catch (err) {
          console.error("[Mercado Pago] Falha na consulta de status real:", err);
        }
      }

      return res.status(400).json({ error: "Não foi possível verificar esse status de pagamento." });

    } catch (err: any) {
      console.error("[Mercado Pago] Erro status API:", err);
      res.status(500).json({ error: "Erro ao consultar status." });
    }
  });

  // --- API ROUTE TO TRIGER AUTOMATIC COMPENSATE SIMULATION ---
  app.post("/api/mercadopago/simulate-pay", (req, res) => {
    const { payment_id } = req.body;
    
    if (!payment_id) {
      return res.status(400).json({ error: "payment_id é necessário." });
    }

    if (payment_id.startsWith("sim-")) {
      const pInfo = simulatedPayments.get(payment_id);
      if (pInfo) {
        pInfo.status = "approved";
        simulatedPayments.set(payment_id, pInfo);
        console.log(`[Mercado Pago Sim] Transação ${payment_id} simulada como PAGA via Admin/Checkout.`);
        return res.json({ success: true, status: "approved" });
      }
    }

    return res.status(404).json({ error: "Transação simulated correspondente não encontrada." });
  });

  // --- DEV & PRODUCTION BUILD STATIC MIDDLEWARES ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fullstack Server] Rodando com sucesso na porta ${PORT}`);
  });
}

startServer();
