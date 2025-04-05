document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões (agora são links <a>)
    const buttons = document.querySelectorAll('.custom-button');
    
    // Adiciona efeito de hover personalizado
    buttons.forEach(button => {
        // Efeito quando o mouse entra no botão
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
        
        // Efeito quando o mouse sai do botão
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
        
        // Efeito quando o botão é clicado
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px)';
        });
    });
    
    // Opcional: Adicionar confirmação antes de sair do site
    /*
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if(!confirm(`Você está saindo para ${this.querySelector('.button-text').textContent}. Continuar?`)) {
                e.preventDefault();
            }
        });
    });
    */
});