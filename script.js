document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.querySelector('.main-nav');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('is-active');
        mainNav.classList.toggle('is-active');
    });

    const form = document.querySelector('.contact-form form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = form.querySelector('input[name="name"]').value;
        const phone = form.querySelector('input[name="phone"]').value;
        const whatsapp = form.querySelector('input[name="whatsapp"]').value;
        const telegram = form.querySelector('input[name="telegram"]').value;
        const company = form.querySelector('input[name="company"]').value;

        const botToken = '7722973835:AAHxR459EC5PlQANwEGzaIcY-ZLLyr_NEWA';
        const chatId = '1306863122';

        // Get current date and time in Bishkek (UTC+6)
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const bishkekTime = new Date(utc + (3600000 * 6));
        const dateTimeString = bishkekTime.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        let message = `🔔 Новая заявка с сайта!\n\n`;
        message += `👤 Имя: ${name}\n`;
        message += `📱 Телефон: ${phone}\n`;
        if (whatsapp) {
            message += `🟢 WhatsApp: ${whatsapp}\n`;
        }
        if (telegram) {
            message += `✈️ Telegram: ${telegram}\n`;
        }
        if (company) {
            message += `🏢 Компания: ${company}\n`;
        }
        message += `\n⏰ Время: ${dateTimeString}`;

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('Спасибо! Ваша заявка успешно отправлена.');
                form.reset();
            } else {
                alert('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('is-active');
        });
    });
});
