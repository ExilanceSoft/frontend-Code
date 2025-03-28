import React, { useState } from "react";

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    rating: 0,
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("description", formData.description);
      form.append("rating", formData.rating);
      if (formData.image) {
        form.append("image", formData.image);
      }

      const response = await fetch("http://localhost:8000/testimonial/", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Your message has been sent successfully!");
        setFormData({ name: "", email: "", description: "", rating: 0, image: null });
      } else {
        setMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to send message. Please try again.");
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="contact section abc">
      <div className="container section-title" data-aos="fade-up">
        <h2>Contact</h2>
        <div>
          <span>Check Our</span> <span className="description-title">Contact</span>
        </div>
      </div>

      <div className="mb-5">
        <iframe
          style={{ width: "100%", height: "400px" }}
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      <div className="container" data-aos="fade">
        <div className="row gy-5 gx-lg-5">
          <div className="col-lg-4">
            <div className="info">
              <h3>Get in touch</h3>
              <p>Contact us for any inquiries or feedback.</p>
              <div className="info-item d-flex">
                <i className="bi bi-geo-alt flex-shrink-0"></i>
                <div>
                  <h4>Location:</h4>
                  <p>A108 Adam Street, New York, NY 535022</p>
                </div>
              </div>
              <div className="info-item d-flex">
                <i className="bi bi-envelope flex-shrink-0"></i>
                <div>
                  <h4>Email:</h4>
                  <p>info@example.com</p>
                </div>
              </div>
              <div className="info-item d-flex">
                <i className="bi bi-phone flex-shrink-0"></i>
                <div>
                  <h4>Call:</h4>
                  <p>+1 5589 55488 55</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="php-email-form">
              <div className="row">
                <div className="col-md-6 form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group mt-3">
                <textarea
                  className="form-control"
                  name="description"
                  placeholder="Enter Description"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* ⭐ Star Rating System and Image Upload Field */}
              <div className="form-group mt-3">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <label className="d-block mb-2">Rate Us:</label>
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} style={{ fontSize: "24px", cursor: "pointer", marginRight: "5px" }}>
                          <input
                            type="radio"
                            name="rating"
                            value={star}
                            checked={formData.rating === star}
                            onChange={() => setFormData((prev) => ({ ...prev, rating: star }))}
                            style={{ display: "none" }}
                          />
                          {star <= formData.rating ? "⭐" : "☆"}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="ml-3">
                    <label className="d-block mb-2">Upload Image:</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="my-3">
                {loading && <div className="loading">Loading...</div>}
                {message && <div className={`sent-message ${message.includes("error") ? "error-message" : ""}`}>{message}</div>}
              </div>
              <div className="text-center">
                <button type="submit" disabled={loading}>Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contactus;