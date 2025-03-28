import React, { useState } from 'react';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import './Contact/Contactus.css';
import reservation from '../assets/img/reservation.jpg';

const Franchise = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    requested_country: null,
    requested_state: null,
    requested_city: null,
    investment_budget: '',
    experience_in_food_business: '',
    additional_details: '',
    request_status: 'pending', // Default status
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Convert country data for react-select
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  // Convert state data based on selected country
  const stateOptions = formData.requested_country
    ? State.getStatesOfCountry(formData.requested_country).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    : [];

  // Convert city data based on selected state
  const cityOptions = formData.requested_country && formData.requested_state
    ? City.getCitiesOfState(formData.requested_country, formData.requested_state).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : [];

  // Handle country change
  const handleCountryChange = (selectedOption) => {
    setFormData({
      ...formData,
      requested_country: selectedOption.value,
      requested_state: null,
      requested_city: null,
    });
  };

  // Handle state change
  const handleStateChange = (selectedOption) => {
    setFormData({
      ...formData,
      requested_state: selectedOption.value,
      requested_city: null,
    });
  };

  // Handle city change
  const handleCityChange = (selectedOption) => {
    setFormData({
      ...formData,
      requested_city: selectedOption.value,
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false); // Reset submission state

    const payload = {
      user_name: formData.user_name,
      user_email: formData.user_email,
      user_phone: formData.user_phone,
      requested_city: formData.requested_city,
      requested_state: formData.requested_state,
      requested_country: formData.requested_country,
      investment_budget: formData.investment_budget,
      experience_in_food_business: formData.experience_in_food_business,
      additional_details: formData.additional_details,
      request_status: formData.request_status,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/franchise/requests/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      const data = await response.json();
      console.log('Response Data:', data); // Logs the response data from the API

      setFormData({
        user_name: '',
        user_email: '',
        user_phone: '',
        requested_country: null,
        requested_state: null,
        requested_city: null,
        investment_budget: '',
        experience_in_food_business: '',
        additional_details: '',
        request_status: 'pending',
      });

      setSubmitted(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book-a-table" className="book-a-table section abc">
      <div className="container section-title" data-aos="fade-up">
        <h2>Franchise Inquiry</h2>
        <div>
          <span>Franchise</span> <span className="description-title">Inquiry</span>
        </div>
      </div>

      <div className="container">
        <div className="row g-0" data-aos="fade-up" data-aos-delay="100">
          <div
            className="col-lg-4 reservation-img"
            style={{ backgroundImage: `url(${reservation})` }}
          ></div>

          <div className="col-lg-8 d-flex align-items-center reservation-form-bg" data-aos="fade-up" data-aos-delay="200">
            <form onSubmit={handleSubmit} className="php-email-form">
              <div className="row gy-4">
                <div className="col-lg-4 col-md-6">
                  <input
                    type="text"
                    name="user_name"
                    className="form-control"
                    placeholder="Your Name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <input
                    type="email"
                    className="form-control"
                    name="user_email"
                    placeholder="Your Email"
                    value={formData.user_email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-lg-4 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="user_phone"
                    placeholder="Your Phone"
                    value={formData.user_phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Country Selector */}
                <div className="col-lg-4 col-md-6">
                  <Select
                    options={countryOptions}
                    value={countryOptions.find((c) => c.value === formData.requested_country)}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                  />
                </div>

                {/* State Selector */}
                <div className="col-lg-4 col-md-6">
                  <Select
                    options={stateOptions}
                    value={stateOptions.find((s) => s.value === formData.requested_state)}
                    onChange={handleStateChange}
                    placeholder="Select State"
                    isDisabled={!formData.requested_country}
                  />
                </div>

                {/* City Selector */}
                <div className="col-lg-4 col-md-6">
                  <Select
                    options={cityOptions}
                    value={cityOptions.find((c) => c.value === formData.requested_city)}
                    onChange={handleCityChange}
                    placeholder="Select City"
                    isDisabled={!formData.requested_state}
                  />
                </div>

                <div className="col-lg-4 col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    name="investment_budget"
                    placeholder="Investment Budget"
                    value={formData.investment_budget}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group mt-3">
                <textarea
                  className="form-control"
                  name="experience_in_food_business"
                  rows="5"
                  placeholder="Experience in Food Business"
                  value={formData.experience_in_food_business}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-group mt-3">
                <textarea
                  className="form-control"
                  name="additional_details"
                  rows="5"
                  placeholder="Additional Details"
                  value={formData.additional_details}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="text-center mt-3">
                <button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Send'}
                </button>
              </div>

              {submitted && <p className="text-success mt-3">Request submitted successfully!</p>}
              {error && <p className="text-danger mt-3">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Franchise;
