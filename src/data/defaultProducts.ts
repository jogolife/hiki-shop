/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, PromoBanner } from '../types';

export const defaultCategories = [
  { id: 'all', name: 'Todos', icon: 'ShoppingBag' },
  { id: 'gamer', name: 'Gamer', icon: 'Gamepad2' },
  { id: 'casa', name: 'Casa', icon: 'Home' },
  { id: 'celulares', name: 'Celulares', icon: 'Smartphone' },
  { id: 'cozinha', name: 'Cozinha', icon: 'Utensils' },
  { id: 'moda', name: 'Moda', icon: 'Shirt' },
  { id: 'informatica', name: 'Informática', icon: 'Cpu' },
];

export const defaultBanners: PromoBanner[] = [
  {
    id: 'banner-1',
    title: 'Semana Tech Arena',
    subtitle: 'Até 40% de Desconto em Eletrônicos Gamer selecionados!',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    link: '#gamer',
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'Sua Casa Conectada',
    subtitle: 'Lâmpadas inteligentes, robôs aspiradores e muito mais a partir de R$ 69,90.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1200',
    link: '#casa',
    isActive: true,
  },
  {
    id: 'banner-3',
    title: 'Estilo Urbano Shopee',
    subtitle: 'Roupas, tênis e acessórios com frete grátis sem valor mínimo neste mês.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
    link: '#moda',
    isActive: true,
  }
];

export const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Mouse Gamer Pro RGB 16000 DPI',
    price: 89.90,
    originalPrice: 149.90,
    description: 'Experimente a máxima precisão com sensor óptico avançado, 16.000 DPI ajustáveis e iluminação RGB de 16.8 milhões de cores customizável. Cabo ultra-leve de paracord e switches mecânicos certificados para 50 milhões de cliques.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600',
    category: 'gamer',
    affiliateLink: 'https://shopee.com.br/Mouse-Gamer-Pro-RGB-High-Spec',
    rating: 4.8,
    reviewsCount: 142,
    isDailyDeal: true,
    isFeatured: true,
    tags: ['Gamer', 'RGB', 'Destaque'],
    brand: 'Redragon',
    attributes: { 'Conexão': 'Com Fio', 'DPI': '16000 DPI' },
    reviews: [
      { id: 'rev-1-1', userName: 'Guilherme S.', rating: 5, comment: 'Mouse fantástico! Muito leve e os cliques são super responsivos. Recomendo muito.', date: '2026-05-20' },
      { id: 'rev-1-2', userName: 'Mariana T.', rating: 4, comment: 'Lindo e funciona perfeitamente, entrega foi mega rápida pelo link promocional.', date: '2026-05-18' }
    ]
  },
  {
    id: 'prod-2',
    title: 'Smart Lâmpada Wi-Fi Inteligente RGB+',
    price: 49.90,
    originalPrice: 79.90,
    description: 'Controle a iluminação da sua casa através do celular ou por comandos de voz via Alexa e Google Assistant. Escolha entre 16 milhões de cores, programe timers e rotinas para economizar energia.',
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=600',
    category: 'casa',
    affiliateLink: 'https://shopee.com.br/Smart-Lampada-Inteligente-Wifi',
    rating: 4.6,
    reviewsCount: 388,
    isDailyDeal: true,
    isFeatured: false,
    tags: ['Casa Inteligente', 'Alexa', 'Oferta'],
    brand: 'Positivo',
    attributes: { 'Potência': '10W', 'Voltagem': 'Bivolt' },
    reviews: [
      { id: 'rev-2-1', userName: 'Thiago M.', rating: 5, comment: 'Fácil instalação e integra rápido com a Alexa. Economia pura.', date: '2026-05-25' }
    ]
  },
  {
    id: 'prod-3',
    title: 'Smartphone UltraVision 5G 256GB',
    price: 2499.00,
    originalPrice: 3299.00,
    description: 'Performance impressionante com tela AMOLED de 120Hz, câmera principal tripla de 108MP com inteligência artificial, bateria monstruosa de 5000mAh e carregamento turbo integrado.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
    category: 'celulares',
    affiliateLink: 'https://www.amazon.com.br/Smartphone-UltraVision-5G-256GB',
    rating: 4.9,
    reviewsCount: 57,
    isDailyDeal: false,
    isFeatured: true,
    tags: ['5G', 'Android', 'Destaque'],
    brand: 'Samsung',
    attributes: { 'Memória RAM': '8GB', 'Armazenamento': '256GB' },
    reviews: [
      { id: 'rev-3-1', userName: 'Alexandre P.', rating: 5, comment: 'Câmera insana! O zoom óptico é excelente. Bateria dura o dia inteiro facilmente.', date: '2026-05-22' }
    ]
  },
  {
    id: 'prod-4',
    title: 'Fritadeira Elétrica Air Fryer Digital 4L',
    price: 389.90,
    originalPrice: 499.00,
    description: 'Prepare refeições crocantes por fora e macias por dentro sem usar uma única gota de óleo. Painel digital touch com 8 funções pré-programadas e cesto antiaderente lavável em lava-louças.',
    image: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=600',
    category: 'cozinha',
    affiliateLink: 'https://www.amazon.com.br/Fritadeira-Eletrica-Air-Fryer-Digital',
    rating: 4.7,
    reviewsCount: 924,
    isDailyDeal: true,
    isFeatured: true,
    tags: ['Air Fryer', 'Cozinha', 'Best-Seller'],
    brand: 'Mondial',
    attributes: { 'Capacidade': '4L', 'Potência': '1500W' },
    reviews: [
      { id: 'rev-4-1', userName: 'Patricia L.', rating: 5, comment: 'Melhor compra do ano! Super prática para fazer pão de queijo e batata frita.', date: '2026-05-15' },
      { id: 'rev-4-2', userName: 'Roberto F.', rating: 4, comment: 'Painel touch é bem bonito, mas o cabo de energia poderia ser maior. Muito boa mesmo.', date: '2026-05-10' }
    ]
  },
  {
    id: 'prod-5',
    title: 'Tênis Running Street-Comfort Unisex',
    price: 189.90,
    originalPrice: 299.90,
    description: 'Perfeito para corridas matinais ou uso casual diário. Desenvolvido com sola amortecedora responsiva de EVA e tecido de mesh respirável que evita o suor e odor. Sinta-se caminhando nas nuvens.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    category: 'moda',
    affiliateLink: 'https://shopee.com.br/Tenis-Running-Street-Comfort-Promo',
    rating: 4.5,
    reviewsCount: 215,
    isDailyDeal: false,
    isFeatured: false,
    tags: ['Corrida', 'Unisex', 'Conforto'],
    brand: 'Olympikus',
    attributes: { 'Gênero': 'Unissex', 'Tamanho': '40' },
    reviews: []
  },
  {
    id: 'prod-6',
    title: 'SSD NVMe M.2 1TB Gen4 Ultra Speed',
    price: 349.00,
    originalPrice: 459.00,
    description: 'Acelere o carregamento do seu PC ou PS5 com taxas de leitura sequencial astronômicas de até 7400 MB/s. Equipado com dissipador de calor de alumínio de alta performance para evitar estrangulamento térmico.',
    image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=600',
    category: 'informatica',
    affiliateLink: 'https://shopee.com.br/SSD-NVMe-M2-1TB-Gen4-Pro',
    rating: 4.9,
    reviewsCount: 88,
    isDailyDeal: false,
    isFeatured: true,
    tags: ['SSD', 'Gen4', 'PS5 Compatible'],
    brand: 'Kingston',
    attributes: { 'Interface': 'Gen4', 'Capacidade': '1TB' },
    reviews: [
      { id: 'rev-6-1', userName: 'Vitor S.', rating: 5, comment: 'Instalado no meu PS5 e carregando tudo instantâneo. Testei as velocidades e bateu certinho.', date: '2026-05-26' }
    ]
  },
  {
    id: 'prod-7',
    title: 'Teclado Mecânico Compacto RGB Switch Blue',
    price: 199.90,
    originalPrice: 279.90,
    description: 'Design elegante de 60% que libera espaço precioso no seu mousepad. Switches azuis proporcionando incrível retorno tátil e som clicky memorável. Cabo USB-C destacável e keycaps double-shot premium.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    category: 'gamer',
    affiliateLink: 'https://www.amazon.com.br/Teclado-Mecanico-Compacto-RGB-Switch-Blue',
    rating: 4.4,
    reviewsCount: 71,
    isDailyDeal: true,
    isFeatured: false,
    tags: ['Teclado Mecânico', 'RGB', 'Compacto'],
    brand: 'Redragon',
    attributes: { 'Switch': 'Azul', 'Layout': '60%' },
    reviews: []
  },
  {
    id: 'prod-8',
    title: 'Cafeteira Italiana de Espresso em Alumínio',
    price: 79.90,
    originalPrice: 119.00,
    description: 'Desfrute do verdadeiro café italiano encorpado de forma simples e rápida no fogão. Fabricada em alumínio polido durável com válvula de segurança patenteada e cabo anatômico isolante térmico de silicone.',
    image: 'https://images.unsplash.com/photo-1545665277-5937489579f2?auto=format&fit=crop&q=80&w=600',
    category: 'cozinha',
    affiliateLink: 'https://shopee.com.br/Cafeteira-Italiana-Aluminio-Tradicional',
    rating: 4.6,
    reviewsCount: 104,
    isDailyDeal: false,
    isFeatured: false,
    tags: ['Café', 'Italiana', 'Utilidades'],
    brand: 'Bialetti',
    attributes: { 'Xícaras': '6 Xícaras', 'Material': 'Alumínio' },
    reviews: []
  },
  {
    id: 'prod-viral-1',
    title: 'Mini Processador de Alimentos Elétrico Recarregável USB',
    price: 34.90,
    originalPrice: 69.90,
    description: 'O processador queridinho do TikTok e Shopee! Triture alho, cebola, temperos e papinhas em segundos com o apertar de um botão. Lâminas reforçadas de aço inoxidável e bateria USB que dura semanas.',
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&q=80&w=600',
    category: 'cozinha',
    affiliateLink: 'https://shopee.com.br/Mini-Processador-Alimentos-Eletrico-Usb',
    rating: 4.8,
    reviewsCount: 1420,
    isDailyDeal: true,
    isFeatured: true,
    tags: ['Cozinha', 'TikTok Viral', 'Praticidade'],
    brand: 'Original-Shop',
    attributes: { 'Alimentação': 'Bateria Recarregável USB', 'Lâminas': '3 Aço Inox' },
    reviews: [
      { id: 'rev-viral-1-1', userName: 'Carolina R.', rating: 5, comment: 'Maravilhoso! Trita alho super rápido, economiza um tempo absurdo e é muito facinho de lavar.', date: '2026-05-24' }
    ]
  },
  {
    id: 'prod-viral-2',
    title: 'Mop Giratório Inteligente Limpeza Rápida com Balde Balanço',
    price: 69.90,
    originalPrice: 129.00,
    description: 'O campeão de vendas absoluto de utilidades de casa da Shopee. Diga adeus ao contato da mão com sujeira e água suja. Centrifugação suave, esfregão de microfibra de alta absorção alcança todos os cantos e debaixo dos móveis.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    category: 'casa',
    affiliateLink: 'https://shopee.com.br/Mop-Giratorio-Inteligente-Limpeza-Rapida',
    rating: 4.7,
    reviewsCount: 3105,
    isDailyDeal: true,
    isFeatured: true,
    tags: ['Casa', 'Lider de Vendas', 'Prático'],
    brand: 'Mop-Brasil',
    attributes: { 'Balde': '8 Litros', 'Cabo': 'Inox 120cm' },
    reviews: [
      { id: 'rev-viral-2-1', userName: 'Carlos E.', rating: 5, comment: 'Super leve e resistente. Minha mãe amou! Limpa a casa inteira em metade do tempo tradicional.', date: '2026-05-25' }
    ]
  },
  {
    id: 'prod-viral-3',
    title: 'Ring Light LED de Mesa Portátil com Suporte de Celular Flexível',
    price: 29.90,
    originalPrice: 59.90,
    description: 'Iluminação perfeita para suas videochamadas, gravações de shorts e selfies. Controle completo com 3 tons de luz (quente, fria, mista) e 10 intensidades ajustáveis. Garra de celular com ajuste universal em 360 graus.',
    image: 'https://images.unsplash.com/photo-1590608897129-79da98d15969?auto=format&fit=crop&q=80&w=600',
    category: 'gamer',
    affiliateLink: 'https://shopee.com.br/Ring-Light-Led-Mesa-TikTok',
    rating: 4.6,
    reviewsCount: 955,
    isDailyDeal: false,
    isFeatured: true,
    tags: ['Iluminação', 'Youtuber', 'Acessório'],
    brand: 'Light-Ring',
    attributes: { 'Alimentação': 'Adaptador USB', 'Tons de Luz': '3 Modos reguláveis' },
    reviews: []
  }
];
