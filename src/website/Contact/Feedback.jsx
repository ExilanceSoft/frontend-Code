import React, { useState } from 'react';
import './Contactus.css';
import reservation from '../../assets/img/reservation.jpg';

const Feedback = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    rate: '',
    message: '',
  });

  // State to manage loading and submission status
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true); // Set loading state
    setError(''); // Clear any previous errors

    try {
      // Send form data to the API
      const response = await fetch('https://your-api-endpoint.com/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const result = await response.json();
      console.log('Feedback submitted successfully:', result);

      // Reset form and set submission status
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        rate: '',
        message: '',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <section id="book-a-table" className="book-a-table section abc">
      <div className="container section-title" data-aos="fade-up">
        <h2>Send Feedback</h2>
        <div>
          <span>Send</span> <span className="description-title">Feedback</span>
        </div>
      </div>

      <div className="container">
        <div className="row g-0" data-aos="fade-up" data-aos-delay="100">
          {/* Background image */}
          <div
            className="col-lg-4 reservation-img"
            style={{ backgroundImage: `url(${reservation})` }}
          ></div>

          {/* Feedback form */}
          <div className="col-lg-8 d-flex align-items-center reservation-form-bg" data-aos="fade-up" data-aos-delay="200">
            <form onSubmit={handleSubmit} className="php-email-form">
              <div className="row gy-4">
                <div className="col-lg-4 col-md-6">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    id="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    id="date"
                    placeholder="Date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <input
                    type="time"
                    className="form-control"
                    name="time"
                    id="time"
                    placeholder="Time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    name="rate"
                    id="rate"
                    placeholder="Rate us up to 5"
                    value={formData.rate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group mt-3">
                <textarea
                  className="form-control"
                  name="message"
                  rows="5"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="text-center mt-3">
                <button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Send'}
                </button>
              </div>
              {submitted && <p className="text-success mt-3">Feedback submitted successfully!</p>}
              {error && <p className="text-danger mt-3">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;