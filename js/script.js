// Aguarda o DOM ser completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    /*====================================
      1. Preloader
    ======================================*/
    const preloader = document.getElementById('preloader');

    // Função para esconder o preloader
    const hidePreloader = () => {
        if (preloader) {
            preloader.classList.add('hidden');
            // Remove o preloader do DOM após a transição para acessibilidade e performance
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            });
        }
    };

    // Esconde o preloader quando todo o conteúdo da página é carregado (incluindo imagens, etc.)
    window.addEventListener('load', hidePreloader);

    // Fallback: Esconde o preloader após um tempo máximo (3 segundos), caso o evento 'load' não dispare
    setTimeout(hidePreloader, 3000);


    /*====================================
      2. Menu de Navegação (Hambúrguer) e Scroll Suave
    ======================================*/
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        const toggleMenu = () => {
            nav.classList.toggle('nav-active'); // Ativa/desativa o menu mobile
            burger.classList.toggle('toggle'); // Anima o ícone hambúrguer para 'X'

            // Animação dos links individuais do menu
            navLinks.forEach((link, index) => {
                if (nav.classList.contains('nav-active')) {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                } else {
                    link.style.animation = ''; // Remove animação ao fechar
                }
            });
        };

        // Event listener para o clique no ícone hambúrguer
        if (burger) { // Verifica se o elemento existe
            burger.addEventListener('click', toggleMenu);
        }

        // Fecha o menu ao clicar em um link de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav-active')) {
                    toggleMenu(); // Fecha o menu
                }
            });
        });

        // Fecha o menu se a tela for redimensionada para desktop (> 768px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && nav.classList.contains('nav-active')) {
                toggleMenu();
            }
        });
    };

    navSlide(); // Inicializa a funcionalidade do menu

    // Scroll suave para seções âncora (o CSS scroll-padding-top já lida com o offset)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previne o comportamento padrão do link

            const targetId = this.getAttribute('href'); // Pega o ID da seção alvo
            const targetElement = document.querySelector(targetId); // Encontra a seção

            if (targetElement) {
                // Usa scrollIntoView para rolagem suave, com o offset do header já tratado pelo CSS
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /*====================================
      3. Scroll Spy: Destaque do Link de Navegação Ativo
    ======================================*/
    const sections = document.querySelectorAll('section[id]'); // Todas as seções com ID
    const navLinks = document.querySelectorAll('.nav-links a'); // Todos os links de navegação
    const header = document.querySelector('header'); // O cabeçalho fixo

    const highlightNavOnScroll = () => {
        let currentSectionId = '';
        const headerOffsetHeight = header ? header.offsetHeight : 0; // Altura do cabeçalho
        const activationOffset = headerOffsetHeight + 50; // Offset para ativar a seção um pouco antes

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Verifica se a posição atual do scroll está dentro dos limites da seção
            if (pageYOffset >= sectionTop - activationOffset && pageYOffset < sectionTop + sectionHeight - activationOffset) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Itera sobre todos os links de navegação para adicionar/remover a classe 'active'
        navLinks.forEach(link => {
            // Remove a classe 'active' de todos os links e seus pais (li)
            link.classList.remove('active');
            if (link.parentElement) {
                link.parentElement.classList.remove('active-section');
            }

            // Adiciona a classe 'active' se o link corresponde à seção atual
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
                if (link.parentElement) {
                    link.parentElement.classList.add('active-section');
                }
            }
        });
    };

    // Adiciona event listeners para scroll e load
    window.addEventListener('scroll', highlightNavOnScroll);
    window.addEventListener('load', highlightNavOnScroll);


    /*====================================
      4. Animação de Digitação no Título do Hero
    ======================================*/
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = ''; // Limpa o texto para começar a digitar

        let charIndex = 0;
        const typeEffect = () => {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeEffect, 80); // Velocidade da digitação
            }
        };
        setTimeout(typeEffect, 1500); // Atraso para iniciar a digitação
    }


    /*====================================
      5. Animação de Elementos ao Rolar (ScrollReveal) - REVISADO PARA MAIOR SUTILEZA
    ======================================*/
    // Verifica se ScrollReveal está carregado antes de usá-lo
    if (typeof ScrollReveal === 'function') {
        try {
            const sr = ScrollReveal({
                reset: false, // Define se a animação deve resetar ao rolar para fora e para dentro
                distance: '20px', // Distância do movimento da animação
                duration: 900, // Duração da animação em ms
                easing: 'ease-in-out', // Curva de aceleração da animação
                scale: 1, // Escala inicial do elemento (1 = tamanho original)
            });

            // Revela APENAS elementos estratégicos para um efeito mais sutil
            sr.reveal('.hero h1', { origin: 'top', delay: 200 }); // Título do Hero
            sr.reveal('.hero p', { origin: 'bottom', delay: 400 }); // Parágrafo do Hero
            sr.reveal('.hero .btn', { origin: 'bottom', delay: 600 }); // Botão do Hero

            // Pode manter para os títulos de seção se quiser que eles chamem a atenção
            sr.reveal('.section-padding h2', { origin: 'top' });

            // Opcional: Revelar a primeira frase de cada seção ou os grids principais uma vez
            sr.reveal('#sobre p:first-of-type', { origin: 'left', delay: 100 }); // Primeiro parágrafo da seção "Sobre"
            sr.reveal('#servicos .services-grid', { origin: 'bottom', delay: 200 }); // Grid de serviços
            sr.reveal('#portfolio .portfolio-filters', { origin: 'top', delay: 100 }); // Filtros de portfólio
            sr.reveal('#tecnologias .tech-grid', { origin: 'bottom', delay: 200 }); // Grid de tecnologias
            sr.reveal('#areas .areas-grid', { origin: 'left', delay: 200 }); // Grid de áreas
            sr.reveal('#equipe .team-grid', { origin: 'bottom', delay: 200 }); // Grid da equipe
            sr.reveal('#contato .contact-form', { origin: 'top', delay: 200 }); // Formulário de contato

            // Removidas as animações individuais para cada item (.service-item, .area-item, etc.)
            // O ScrollReveal ainda está carregado, mas aplicado a menos elementos.

        } catch (e) {
            console.error("Erro ao inicializar ScrollReveal ou ao chamar .reveal:", e);
        }
    } else {
        console.warn("ScrollReveal não foi carregado corretamente. As animações de rolagem não funcionarão. Verifique sua conexão com a CDN.");
    }


    /*====================================
      6. Validação e Envio de Formulário de Contato (Formspree)
    ======================================*/
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm && submitButton) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Previne o envio padrão do formulário

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageTextarea = document.getElementById('contact-message');

            let isValid = true;

            // Validações básicas dos campos
            if (nameInput.value.trim() === '') {
                alert('Por favor, preencha seu nome completo.');
                nameInput.focus();
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simples para email
            if (isValid && !emailRegex.test(emailInput.value.trim())) {
                alert('Por favor, insira um e-mail válido.');
                emailInput.focus();
                isValid = false;
            }

            if (isValid && messageTextarea.value.trim() === '') {
                alert('Por favor, digite sua mensagem.');
                messageTextarea.focus();
                isValid = false;
            }

            // Se a validação passou, tenta enviar o formulário
            if (isValid) {
                // Desabilita o botão para evitar múltiplos envios e dá feedback visual
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                submitButton.style.opacity = '0.7';
                submitButton.style.cursor = 'not-allowed';

                const formData = new FormData(contactForm);
                const formspreeUrl = 'https://formspree.io/f/xzzvdoav'; // <<< COLOQUE SUA URL DO FORMSPREE AQUI! >>>

                try {
                    const response = await fetch(formspreeUrl, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json' // Solicita resposta em JSON
                        }
                    });

                    const result = await response.json(); // Converte a resposta para JSON

                    if (response.ok) { // Se a resposta do servidor for 200 OK
                        contactForm.reset(); // Limpa o formulário
                        contactForm.style.display = 'none'; // Esconde o formulário
                        successMessage.style.display = 'flex'; // Mostra a mensagem de sucesso
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Rola para a mensagem

                        // Alerta especial para a primeira vez do Formspree (confirmação de email)
                        if (result.message && result.message.includes('confirm your email address')) {
                            alert('Mensagem enviada! POR FAVOR, VERIFIQUE SEU E-MAIL (E A PASTA DE SPAM) PARA CONFIRMAR SEU ENDEREÇO COM O FORMSPREE. É UM PASSO ÚNICO PARA ATIVAR O FORMULÁRIO. Após a confirmação, os próximos e-mails chegarão normalmente.');
                        }

                    } else { // Se o servidor retornou um erro (ex: 400, 500)
                        console.error('Erro detalhado do Formspree:', result.errors || result.message);
                        alert(`Ocorreu um erro ao enviar sua mensagem: ${result.message || 'Por favor, tente novamente mais tarde.'}\nVerifique o console (F12) para mais detalhes.`);
                    }
                } catch (error) { // Erros de rede ou resposta inválida
                    console.error('Erro ao enviar o formulário (problema de rede ou resposta inválida):', error);
                    alert('Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.');
                } finally {
                    // Reabilita o botão do formulário e restaura seu estado original
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar Mensagem';
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                }
            }
        });
    }

    // Lógica para o botão "Voltar ao Início" da mensagem de sucesso
    const btnVoltarInicio = document.querySelector('.btn-volta-inicio');
    if (btnVoltarInicio) {
        btnVoltarInicio.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo da página
            successMessage.style.display = 'none'; // Esconde a mensagem de sucesso
            contactForm.style.display = 'flex'; // Reaparece o formulário de contato
        });
    }


    /*====================================
      7. Atualizar Ano no Footer Automaticamente
    ======================================*/
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    /*====================================
      8. Filtragem de Portfólio por Categoria
    ======================================*/
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' do botão atualmente ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter'); // Pega o valor do filtro (ex: 'web-dev', 'all')

            portfolioItems.forEach(item => {
                // Pega as categorias do item e as divide em um array (ex: ['web-dev', 'web-app'])
                const itemCategories = item.getAttribute('data-category').split(' ');

                // Se o filtro é 'all' ou o item possui a categoria selecionada
                if (filterValue === 'all' || itemCategories.includes(filterValue)) {
                    item.classList.remove('hidden'); // Mostra o item
                } else {
                    item.classList.add('hidden'); // Esconde o item
                }
            });
        });
    });

    // Ativa o filtro "Todos" por padrão ao carregar a página
    const allFilterButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterButton) {
        allFilterButton.click(); // Simula um clique no botão "Todos"
    }


    /*====================================
      9. Lógica de Modo Claro/Escuro
    ======================================*/
    const themeToggleBtn = document.getElementById('theme-toggle'); // Botão de alternância
    const htmlElement = document.documentElement; // O elemento <html> (onde a classe 'light-mode' é aplicada)

    // Função para aplicar o tema (light ou dark)
    const applyTheme = (theme) => {
        if (theme === 'light') {
            htmlElement.classList.add('light-mode');
            // Altera o ícone para sol
            if (themeToggleBtn && themeToggleBtn.querySelector('i')) {
                themeToggleBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            }
            themeToggleBtn.setAttribute('aria-label', 'Alternar para modo escuro');
        } else {
            htmlElement.classList.remove('light-mode');
            // Altera o ícone para lua
            if (themeToggleBtn && themeToggleBtn.querySelector('i')) {
                themeToggleBtn.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            }
            themeToggleBtn.setAttribute('aria-label', 'Alternar para modo claro');
        }
    };

    // Carregar o tema preferido do usuário (do localStorage) ao carregar a página
    // Se não houver preferência salva, verifica a preferência do sistema operacional
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme) {
        applyTheme(savedTheme); // Aplica o tema salvo
    } else if (prefersLight) {
        applyTheme('light'); // Se o sistema prefere claro, aplica o modo claro
    } else {
        applyTheme('dark'); // Caso contrário, aplica o modo escuro (padrão)
    }

    // Event listener para alternar o tema ao clicar no botão
    if (themeToggleBtn) { // Verifica se o botão existe
        themeToggleBtn.addEventListener('click', () => {
            if (htmlElement.classList.contains('light-mode')) {
                applyTheme('dark');
                localStorage.setItem('theme', 'dark'); // Salva a preferência
            } else {
                applyTheme('light');
                localStorage.setItem('theme', 'light'); // Salva a preferência
            }
        });
    }

});