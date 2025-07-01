
'use server';

import { db } from '@/lib/firebase';
import type { Resource } from '@/types';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy, 
  Timestamp,
  serverTimestamp,
  query
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const sampleResources: Resource[] = [
  // AI & Machine Learning
  {
    id: 'openai-gpt-4-api',
    name: 'OpenAI GPT-4 API',
    description: 'Acesso à API do modelo de linguagem mais avançado da OpenAI para diversas aplicações, de geração de texto a análise.',
    link: 'https://openai.com/gpt-4/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T10:00:00Z'),
  },
  {
    id: 'google-cloud-ai-platform',
    name: 'Google Cloud AI Platform',
    description: 'Conjunto de serviços de ML gerenciados que permite construir, treinar e implantar modelos em escala.',
    link: 'https://cloud.google.com/ai-platform/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T09:50:00Z'),
  },
  {
    id: 'aws-sagemaker',
    name: 'AWS SageMaker',
    description: 'Serviço de ML totalmente gerenciado que ajuda desenvolvedores e cientistas de dados a construir, treinar e implantar modelos rapidamente.',
    link: 'https://aws.amazon.com/sagemaker/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T09:40:00Z'),
  },
  {
    id: 'azure-machine-learning',
    name: 'Azure Machine Learning',
    description: 'Plataforma de nuvem para acelerar o ciclo de vida de aprendizado de máquina, incluindo treinamento, implantação e gerenciamento de modelos.',
    link: 'https://azure.microsoft.com/en-us/products/machine-learning/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T09:30:00Z'),
  },
  {
    id: 'hugging-face-inference-apis',
    name: 'Hugging Face Hub (Inference APIs)',
    description: 'Oferece Inference APIs pagas para uso em produção de modelos populares, embora muitos modelos sejam gratuitos.',
    link: 'https://huggingface.co/docs/api-inference/pricing',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T09:20:00Z'),
  },
  {
    id: 'cohere-api',
    name: 'Cohere API',
    description: 'Oferece modelos de linguagem grandes e poderosos para geração, incorporação e pesquisa, com planos pagos para uso comercial.',
    link: 'https://cohere.com/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T09:10:00Z'),
  },
  {
    id: 'weights-and-biases',
    name: 'Weights & Biases',
    description: 'Plataforma para rastreamento, visualização e colaboração em experimentos de aprendizado de máquina.',
    link: 'https://wandb.ai/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T09:00:00Z'),
  },
  {
    id: 'runwayml',
    name: 'RunwayML',
    description: 'Plataforma para criação de conteúdo visual usando IA (geração de vídeo, imagem, edição), com planos pagos.',
    link: 'https://runwayml.com/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T08:50:00Z'),
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Gerador de imagens a partir de texto (text-to-image) de alta qualidade, operado via Discord, com planos de assinatura.',
    link: 'https://www.midjourney.com/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T08:40:00Z'),
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description: 'Permite rodar modelos de IA no cloud com uma API simples, pagando apenas pelo uso, com diversos modelos pré-treinados.',
    link: 'https://replicate.com/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T08:30:00Z'),
  },
  {
    id: 'google-colab',
    name: 'Google Colab',
    description: 'Permite escrever e executar código Python no navegador, com acesso gratuito a GPUs e TPUs para ML.',
    link: 'https://colab.research.google.com/',
    category: 'AI & Machine Learning',
    pricing: 'Free Tier',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T08:20:00Z'),
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    description: 'Plataforma de competições de ciência de dados que oferece notebooks gratuitos com GPUs e acesso a grandes datasets.',
    link: 'https://www.kaggle.com/',
    category: 'AI & Machine Learning',
    pricing: 'Free Tier',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T08:10:00Z'),
  },
  {
    id: 'hugging-face-hub-models',
    name: 'Hugging Face Hub (Model Repository)',
    description: 'Milhares de modelos pré-treinados e datasets abertos disponíveis para download e uso gratuito.',
    link: 'https://huggingface.co/models',
    category: 'AI & Machine Learning',
    pricing: 'Free Tier',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T08:00:00Z'),
  },
  {
    id: 'gradio',
    name: 'Gradio',
    description: 'Biblioteca Python para construir interfaces de usuário rápidas para modelos de ML, permitindo demonstrações interativas.',
    link: 'https://www.gradio.app/',
    category: 'AI & Machine Learning',
    pricing: 'Free Tier',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T07:50:00Z'),
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    description: 'Biblioteca open source completa para aprendizado de máquina, desenvolvida pelo Google.',
    link: 'https://www.tensorflow.org/',
    category: 'AI & Machine Learning',
    pricing: 'Open Source',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T07:40:00Z'),
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    description: 'Framework open source de aprendizado de máquina do Facebook (Meta), conhecido por sua flexibilidade.',
    link: 'https://pytorch.org/',
    category: 'AI & Machine Learning',
    pricing: 'Open Source',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T07:30:00Z'),
  },
  {
    id: 'scikit-learn',
    name: 'scikit-learn',
    description: 'Biblioteca Python para aprendizado de máquina clássico (classificação, regressão, clustering).',
    link: 'https://scikit-learn.org/',
    category: 'AI & Machine Learning',
    pricing: 'Open Source',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T07:20:00Z'),
  },
  {
    id: 'keras',
    name: 'Keras',
    description: 'API de alto nível para construir e treinar modelos de deep learning, que pode rodar sobre TensorFlow ou PyTorch.',
    link: 'https://keras.io/',
    category: 'AI & Machine Learning',
    pricing: 'Open Source',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T07:10:00Z'),
  },
  {
    id: 'jupyter-notebook-lab',
    name: 'Jupyter Notebook / Lab',
    description: 'Ambiente de computação interativo open source para criar e compartilhar documentos com código, equações e visualizações.',
    link: 'https://jupyter.org/',
    category: 'AI & Machine Learning',
    pricing: 'Open Source',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-21T07:00:00Z'),
  },

  // Developer Tools
  {
    id: 'jetbrains-idea-ultimate',
    name: 'JetBrains IntelliJ IDEA Ultimate',
    description: 'Uma IDE poderosa para desenvolvimento Java, Kotlin, Scala e outras linguagens, com recursos avançados.',
    link: 'https://www.jetbrains.com/idea/',
    category: 'Developer Tools',
    pricing: 'Paid',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T10:00:00Z'),
  },
  {
    id: 'sublime-text',
    name: 'Sublime Text',
    description: 'Um editor de código sofisticado e rápido, conhecido por sua interface de usuário elegante e alto desempenho.',
    link: 'https://www.sublimetext.com/',
    category: 'Developer Tools',
    pricing: 'Paid',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T09:50:00Z'),
  },
  {
    id: 'postman-paid',
    name: 'Postman',
    description: 'Plataforma de colaboração para desenvolvimento de APIs. Oferece planos pagos para equipes e recursos avançados.',
    link: 'https://www.postman.com/',
    category: 'Developer Tools',
    pricing: 'Paid',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T09:40:00Z'),
  },
   {
    id: 'tower-git',
    name: 'Tower',
    description: 'Cliente Git GUI (interface gráfica do usuário) para Mac e Windows, que simplifica o uso do Git.',
    link: 'https://www.git-tower.com/',
    category: 'Developer Tools',
    pricing: 'Paid',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T09:30:00Z'),
  },
  {
    id: 'sentry-free-tier',
    name: 'Sentry (Free Tier)',
    description: 'Monitoramento de erros em tempo real que ajuda a descobrir e priorizar erros em seu código, com um plano gratuito.',
    link: 'https://sentry.io/pricing/',
    category: 'Developer Tools',
    pricing: 'Free Tier',
    icon: 'Component',
    createdAt: new Date('2024-05-20T09:20:00Z'),
  },
  {
    id: 'codesandbox',
    name: 'CodeSandbox',
    description: 'Um ambiente de desenvolvimento online para projetos web, com foco em desenvolvimento front-end e prototipagem.',
    link: 'https://codesandbox.io/',
    category: 'Developer Tools',
    pricing: 'Free Tier',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T09:10:00Z'),
  },
  {
    id: 'ngrok',
    name: 'Ngrok',
    description: 'Cria túneis seguros para sua máquina local a partir da internet, ótimo para testar webhooks ou compartilhar um ambiente de dev.',
    link: 'https://ngrok.com/',
    category: 'Developer Tools',
    pricing: 'Free Tier',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T09:00:00Z'),
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'Um editor de código-fonte leve, mas poderoso, com suporte a milhares de extensões, tornando-o extremamente versátil.',
    link: 'https://code.visualstudio.com/',
    category: 'Developer Tools',
    pricing: 'Open Source',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T08:50:00Z'),
  },
  {
    id: 'git',
    name: 'Git',
    description: 'O sistema de controle de versão distribuído mais amplamente usado, essencial para o desenvolvimento colaborativo.',
    link: 'https://git-scm.com/',
    category: 'Developer Tools',
    pricing: 'Open Source',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T08:40:00Z'),
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Plataforma open source para desenvolver, enviar e executar aplicativos usando contêineres.',
    link: 'https://www.docker.com/',
    category: 'Developer Tools',
    pricing: 'Open Source',
    icon: 'Server',
    createdAt: new Date('2024-05-20T08:30:00Z'),
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Ambiente de tempo de execução JavaScript open source que permite construir aplicativos de rede escaláveis.',
    link: 'https://nodejs.org/',
    category: 'Developer Tools',
    pricing: 'Open Source',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T08:20:00Z'),
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Linguagem de programação open source popular para web, ciência de dados, IA, e automação.',
    link: 'https://www.python.org/',
    category: 'Developer Tools',
    pricing: 'Open Source',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T08:10:00Z'),
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Sistema open source para automatizar a implantação, escalamento e gerenciamento de aplicativos conteinerizados.',
    link: 'https://kubernetes.io/',
    category: 'Developer Tools',
    pricing: 'Open Source',
    icon: 'Server',
    createdAt: new Date('2024-05-20T08:00:00Z'),
  },
  {
    id: 'eslint',
    name: 'ESLint',
    description: 'Ferramenta de linting para JavaScript e JSX, que ajuda a identificar e corrigir problemas em seu código.',
    link: 'https://eslint.org/',
    category: 'Developer Tools',
    pricing: 'Open Source',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T07:50:00Z'),
  },
  {
    id: 'prettier',
    name: 'Prettier',
    description: 'Um formatador de código opinativo que impõe um estilo consistente em todo o seu projeto.',
    link: 'https://prettier.io/',
    category: 'Developer Tools',
    pricing: 'Open Source',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-20T07:40:00Z'),
  },

  // DevOps & Hosting
  {
    id: 'aws',
    name: 'AWS (Amazon Web Services)',
    description: 'A maior plataforma de nuvem do mundo, oferecendo uma vasta gama de serviços para computação, armazenamento, e mais.',
    link: 'https://aws.amazon.com/',
    category: 'DevOps & Hosting',
    pricing: 'Paid',
    icon: 'Server',
    createdAt: new Date('2024-05-19T10:00:00Z'),
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform (GCP)',
    description: 'Oferece uma suite de serviços de computação em nuvem, incluindo IaaS, PaaS e ambientes serverless.',
    link: 'https://cloud.google.com/',
    category: 'DevOps & Hosting',
    pricing: 'Paid',
    icon: 'Server',
    createdAt: new Date('2024-05-19T09:50:00Z'),
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    description: 'Uma plataforma de computação em nuvem que fornece serviços de desenvolvimento, computação, rede, análise, e armazenamento.',
    link: 'https://azure.microsoft.com/',
    category: 'DevOps & Hosting',
    pricing: 'Paid',
    icon: 'Server',
    createdAt: new Date('2024-05-19T09:40:00Z'),
  },
  {
    id: 'digitalocean',
    name: 'DigitalOcean',
    description: 'Um provedor de infraestrutura de nuvem simples e escalável, popular por seus "Droplets" (VMs).',
    link: 'https://www.digitalocean.com/',
    category: 'DevOps & Hosting',
    pricing: 'Paid',
    icon: 'Server',
    createdAt: new Date('2024-05-19T09:30:00Z'),
  },
  {
    id: 'datadog',
    name: 'Datadog',
    description: 'Plataforma de monitoramento e segurança para aplicações em nuvem em larga escala.',
    link: 'https://www.datadoghq.com/',
    category: 'DevOps & Hosting',
    pricing: 'Paid',
    icon: 'Server',
    createdAt: new Date('2024-05-19T09:20:00Z'),
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Oferece um plano gratuito generoso para hospedar sites estáticos e SPAs, com CI/CD e HTTPS.',
    link: 'https://www.netlify.com/pricing/',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-19T09:10:00Z'),
  },
  {
    id: 'vercel-hobby',
    name: 'Vercel (Hobby Plan)',
    description: 'Permite hospedar projetos pessoais e não comerciais gratuitamente, com CI/CD e funções serverless.',
    link: 'https://vercel.com/pricing',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-19T09:00:00Z'),
  },
  {
    id: 'render',
    name: 'Render',
    description: 'Oferece uma camada gratuita para serviços web estáticos, bancos de dados e mais, facilitando a implantação.',
    link: 'https://render.com/pricing',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-19T08:50:00Z'),
  },
  {
    id: 'cloudflare-workers',
    name: 'Cloudflare Workers',
    description: 'Permite executar código JavaScript na rede global da Cloudflare com um plano gratuito generoso.',
    link: 'https://www.cloudflare.com/lp/workers-free/',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-19T08:40:00Z'),
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    description: 'O serviço CI/CD integrado ao GitHub oferece minutos de execução gratuitos por mês para repositórios.',
    link: 'https://github.com/features/actions',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-19T08:30:00Z'),
  },
  {
    id: 'firebase-hosting',
    name: 'Firebase Hosting',
    description: 'Parte do Firebase, oferece hospedagem rápida e segura para conteúdo web com um generoso plano gratuito.',
    link: 'https://firebase.google.com/docs/hosting/',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-19T08:20:00Z'),
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    description: 'Servidor de automação open source líder para CI/CD, flexível e com milhares de plugins.',
    link: 'https://www.jenkins.io/',
    category: 'DevOps & Hosting',
    pricing: 'Open Source',
    icon: 'Server',
    createdAt: new Date('2024-05-19T08:10:00Z'),
  },
  {
    id: 'ansible',
    name: 'Ansible',
    description: 'Ferramenta open source de automação de TI para gerenciamento de configuração, implantação e orquestração.',
    link: 'https://www.ansible.com/',
    category: 'DevOps & Hosting',
    pricing: 'Open Source',
    icon: 'Server',
    createdAt: new Date('2024-05-19T08:00:00Z'),
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    description: 'Sistema open source de monitoramento e alerta de sistemas em tempo real, popular em ambientes de nuvem nativa.',
    link: 'https://prometheus.io/',
    category: 'DevOps & Hosting',
    pricing: 'Open Source',
    icon: 'Server',
    createdAt: new Date('2024-05-19T07:50:00Z'),
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Ferramenta open source para visualização e análise de dados, usada com Prometheus para dashboards.',
    link: 'https://grafana.com/',
    category: 'DevOps & Hosting',
    pricing: 'Open Source',
    icon: 'Server',
    createdAt: new Date('2024-05-19T07:40:00Z'),
  },
  {
    id: 'terraform',
    name: 'Terraform',
    description: 'Ferramenta open source de Infraestrutura como Código (IaC) para provisionar e gerenciar infraestrutura.',
    link: 'https://www.terraform.io/',
    category: 'DevOps & Hosting',
    pricing: 'Open Source',
    icon: 'Server',
    createdAt: new Date('2024-05-19T07:30:00Z'),
  },
  
  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    description: 'Um espaço de trabalho tudo-em-um para anotações, gerenciamento de projetos, bancos de dados, wikis e colaboração.',
    link: 'https://www.notion.so/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Zap',
    createdAt: new Date('2024-05-18T10:00:00Z'),
  },
  {
    id: 'todoist',
    name: 'Todoist',
    description: 'Um aplicativo de lista de tarefas e gerenciamento de projetos que ajuda a organizar o trabalho e a vida pessoal.',
    link: 'https://todoist.com/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Zap',
    createdAt: new Date('2024-05-18T09:50:00Z'),
  },
  {
    id: 'forest-app',
    name: 'Forest',
    description: 'Um aplicativo de produtividade que ajuda a focar e evitar distrações, plantando uma árvore virtual.',
    link: 'https://www.forestapp.cc/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Zap',
    createdAt: new Date('2024-05-18T09:40:00Z'),
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    description: 'Uma plataforma de gerenciamento de projetos que centraliza tarefas, documentos, metas e chat.',
    link: 'https://clickup.com/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Zap',
    createdAt: new Date('2024-05-18T09:30:00Z'),
  },
  {
    id: 'rescuetime',
    name: 'RescueTime',
    description: 'Aplicativo de rastreamento de tempo automático que monitora suas atividades e fornece relatórios detalhados.',
    link: 'https://www.rescuetime.com/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Zap',
    createdAt: new Date('2024-05-18T09:20:00Z'),
  },
  {
    id: 'things-3',
    name: 'Things 3 (macOS/iOS)',
    description: 'Um gerenciador de tarefas premiado, conhecido por seu design limpo e interface intuitiva.',
    link: 'https://culturedcode.com/things/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Zap',
    createdAt: new Date('2024-05-18T09:10:00Z'),
  },
  {
    id: 'dashlane',
    name: 'Dashlane',
    description: 'Gerenciador de senhas e carteira digital que ajuda a proteger suas contas online e preencher formulários.',
    link: 'https://www.dashlane.com/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Zap',
    createdAt: new Date('2024-05-18T09:00:00Z'),
  },
  {
    id: 'krisp',
    name: 'Krisp',
    description: 'Um aplicativo de cancelamento de ruído baseado em IA que remove ruídos de fundo de chamadas e reuniões.',
    link: 'https://krisp.ai/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Zap',
    createdAt: new Date('2024-05-18T08:50:00Z'),
  },
  {
    id: 'figma-paid',
    name: 'Figma (Professional Plan)',
    description: 'Planos pagos oferecem recursos avançados de colaboração, prototipagem e design system para equipes.',
    link: 'https://www.figma.com/pricing/',
    category: 'Productivity',
    pricing: 'Paid',
    icon: 'Palette',
    createdAt: new Date('2024-05-18T08:40:00Z'),
  },

  // UI & Design (From Previous List)
  {
    id: 'shadcn-ui',
    name: 'shadcn/ui',
    description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    link: 'https://ui.shadcn.com/',
    category: 'UI & Design',
    pricing: 'Open Source',
    icon: 'Palette',
    createdAt: new Date('2024-05-17T11:00:00Z'),
  },
  {
    id: 'figma-free',
    name: 'Figma',
    description: 'A collaborative interface design tool that allows teams to design, prototype, and gather feedback all in one place.',
    link: 'https://www.figma.com/',
    category: 'UI & Design',
    pricing: 'Free Tier',
    icon: 'Palette',
    createdAt: new Date('2024-05-17T10:00:00Z'),
  },
  {
    id: 'undraw',
    name: 'unDraw',
    description: 'Open-source illustrations for any idea you can imagine and create. Completely free to use in any project.',
    link: 'https://undraw.co/illustrations',
    category: 'UI & Design',
    pricing: 'Free',
    icon: 'Palette',
    createdAt: new Date('2024-05-17T09:00:00Z'),
  },

  // Books & Courses (From Previous List)
  {
    id: 'clean-code-book',
    name: 'Clean Code by Robert C. Martin',
    description: 'A handbook of agile software craftsmanship. A must-read for any developer looking to improve their code quality.',
    link: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
    category: 'Books & Courses',
    pricing: 'Paid',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T14:00:00Z'),
  },
  {
    id: 'freecodecamp',
    name: 'freeCodeCamp',
    description: 'A non-profit organization that consists of an interactive learning web platform, an online community forum, and thousands of articles.',
    link: 'https://www.freecodecamp.org/',
    category: 'Books & Courses',
    pricing: 'Free',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T13:00:00Z'),
  },
  {
    id: 'mdn-web-docs',
    name: 'MDN Web Docs',
    description: 'The ultimate resource for web developers, maintained by a community of developers and technical writers.',
    link: 'https://developer.mozilla.org/',
    category: 'Books & Courses',
    pricing: 'Free',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T12:00:00Z'),
  }
];

export async function getResources(): Promise<Resource[]> {
  if (!db) {
    console.warn("Firestore is not initialized. Returning sample resources.");
    return sampleResources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  try {
    const resourcesCollection = collection(db, 'resources');
    const q = query(resourcesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log("No resources found in Firestore, populating with sample data.");
        // When no data in DB, populate it with sample data
        const batch = (await import('firebase/firestore')).writeBatch(db);
        sampleResources.forEach(resource => {
            const { id, ...data } = resource;
            const docRef = doc(collection(db, 'resources')); // Firestore will generate ID
            batch.set(docRef, { ...data, createdAt: Timestamp.fromDate(data.createdAt) });
        });
        await batch.commit();
        // After populating, fetch again to get correct IDs
        const newSnapshot = await getDocs(q);
        return newSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp).toDate(),
            } as Resource;
        });
    }
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as Resource;
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    // Fallback to local sample data on error
    return sampleResources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getResourceById(id: string): Promise<Resource | null> {
    if (!db) {
        console.warn("Firestore is not initialized.");
        // Find by the custom 'id' field in the local sample data
        return sampleResources.find(r => r.id === id) || null;
    }

    try {
        const resourceRef = doc(db, 'resources', id);
        const docSnap = await getDoc(resourceRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Resource;

    } catch (error) {
        console.error("Error fetching resource by id:", error);
        return null;
    }
}

export async function addResource(resourceData: Omit<Resource, 'id' | 'createdAt'>) {
    if (!db) throw new Error("Firestore is not initialized.");

    const newResource = {
        ...resourceData,
        createdAt: serverTimestamp(),
    };
    
    await addDoc(collection(db, 'resources'), newResource);
    revalidatePath('/dashboard/resources');
    revalidatePath('/resources');
}

export async function updateResource(id: string, resourceData: Partial<Omit<Resource, 'id' | 'createdAt'>>) {
    if (!db) throw new Error("Firestore is not initialized.");
    
    const resourceRef = doc(db, 'resources', id);
    await updateDoc(resourceRef, resourceData);

    revalidatePath('/dashboard/resources');
    revalidatePath('/resources');
}

export async function deleteResource(id: string) {
    if (!db) throw new Error("Firestore is not initialized.");
    
    const resourceRef = doc(db, 'resources', id);
    await deleteDoc(resourceRef);

    revalidatePath('/dashboard/resources');
    revalidatePath('/resources');
}
