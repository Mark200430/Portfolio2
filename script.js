// Typing animation
const texts = [
    "Mark Louin Torres"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.querySelector('.typed-text');

function typeText() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeText, typeSpeed);
}

// Background music and sound effects
let backgroundMusic;
let isMusicPlaying = false;

// Initialize audio
function initializeAudio() {
    // Create background music (we'll use a simple tone generator)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function createBackgroundMusic() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 2);
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 4);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        oscillator.type = 'sine';
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 4);
        
        // Loop the music
        setTimeout(() => {
            if (isMusicPlaying) {
                createBackgroundMusic();
            }
        }, 4000);
    }
    
    // Button click sound
    function createButtonSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.type = 'square';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    return { createBackgroundMusic, createButtonSound };
}

// Start everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Start typing animation
    typeText();
    
    // Initialize audio
    const audio = initializeAudio();
    
    // Add click sound to all buttons
    const buttons = document.querySelectorAll('button, .project-link, .nav-menu a');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            audio.createButtonSound();
        });
    });
    
    // Music control button
    const musicToggle = document.createElement('button');
    musicToggle.innerHTML = '<i class="fas fa-music"></i> Music';
    musicToggle.className = 'music-toggle';
    musicToggle.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, var(--jungle-primary), var(--jungle-secondary));
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 1001;
        font-size: 14px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: transform 0.3s ease;
    `;
    
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            isMusicPlaying = false;
            musicToggle.innerHTML = '<i class="fas fa-music"></i> Music Off';
            musicToggle.style.opacity = '0.6';
        } else {
            isMusicPlaying = true;
            audio.createBackgroundMusic();
            musicToggle.innerHTML = '<i class="fas fa-music"></i> Music On';
            musicToggle.style.opacity = '1';
        }
    });
    
    musicToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    musicToggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(musicToggle);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Play success sound
            audio.createButtonSound();
            
            // Show success message
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = 'linear-gradient(45deg, var(--jungle-primary), var(--jungle-secondary))';
                this.reset();
            }, 3000);
        });
    }
});

// Scroll animations
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const jungle = document.querySelector('.jungle-bg');
    if (jungle) {
        jungle.style.transform = `translateY(${rate}px)`;
    }
});