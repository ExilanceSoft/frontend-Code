import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStore, faUtensils } from '@fortawesome/free-solid-svg-icons'; // Import icons

const WhyUs = () => {
  const reasons = [
    {
      id: 1,
      number: '01',
      title: 'Happy Customers',
      description: 'We have served thousands of satisfied customers who love our delicious food and excellent service.',
      icon: faUsers, // Icon for Customers
    },
    {
      id: 2,
      number: '02',
      title: 'Franchises',
      description: 'Join our growing network of franchises and bring the taste of our restaurant to your community.',
      icon: faStore, // Icon for Franchises
    },
    {
      id: 3,
      number: '03',
      title: 'Diverse Menu',
      description: 'Explore our wide range of dishes, from burgers and pizzas to sandwiches and beverages.',
      icon: faUtensils, // Icon for Menu
    },
  ];

  // State for counters
  const [counters, setCounters] = useState({
    counter1: 0,
    counter2: 0,
    counter3: 0,
  });

  // Simulate counting animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prev) => ({
        counter1: prev.counter1 < 1000 ? prev.counter1 + 10 : prev.counter1, // Customers
        counter2: prev.counter2 < 50 ? prev.counter2 + 1 : prev.counter2, // Franchises
        counter3: prev.counter3 < 100 ? prev.counter3 + 5 : prev.counter3, // Menu Items
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="why-us" className="why-us section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Why Us</h2>
        <div>
          <span>Why choose</span> <span className="description-title">Our Restaurant</span>
        </div>
      </div>

      <div className="container">
        <div className="row gy-4">
          {reasons.map((reason, index) => (
            <div className="col-lg-4" key={reason.id} data-aos="fade-up" data-aos-delay={reason.id * 100}>
              <div className="card-item">
                {/* Icon */}
                <div className="icon">
                  <FontAwesomeIcon icon={reason.icon} />
                </div>
                {/* Counter */}
                <span className="counter">{counters[`counter${index + 1}`]}+</span>
                <h4><a href="" className="stretched-link">{reason.title}</a></h4>
                <p>{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;