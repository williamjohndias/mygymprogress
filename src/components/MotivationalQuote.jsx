import React, { useState, useEffect } from 'react'
import './MotivationalQuote.css'

const quotes = [
  { text: "The only bad workout is the one that didn't happen.", author: "Arnold Schwarzenegger" },
  { text: "Ain't nothing to it but to do it!", author: "Ronnie Coleman" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "The body achieves what the mind believes.", author: "Ronnie Coleman" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
  { text: "Excuses don't build muscle. Action does.", author: "Ronnie Coleman" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "The last three or four reps is what makes the muscle grow.", author: "Arnold Schwarzenegger" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { text: "Train insane or remain the same.", author: "Ronnie Coleman" },
  { text: "Champions aren't made in gyms. Champions are made from something deep inside them.", author: "Muhammad Ali" },
  { text: "Your body can stand almost anything. It's your mind you need to convince.", author: "Arnold Schwarzenegger" },
  { text: "The moment you want to quit is the moment you need to push harder.", author: "Unknown" },
  { text: "The only way to prove you're a good sport is to lose.", author: "Ernie Banks" },
  { text: "I don't count my sit-ups. I only start counting when it starts hurting.", author: "Muhammad Ali" }
]

function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true)
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length)
        setCurrentQuote(quotes[randomIndex])
        setFade(false)
      }, 300)
    }, 8000) // Change quote every 8 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`motivational-quote ${fade ? 'fade-out' : 'fade-in'}`}>
      <div className="quote-content">
        <p className="quote-text">"{currentQuote.text}"</p>
        <p className="quote-author">— {currentQuote.author}</p>
      </div>
    </div>
  )
}

export default MotivationalQuote

