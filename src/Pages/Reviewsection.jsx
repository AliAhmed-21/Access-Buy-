import React, { useState } from "react";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([
    {
      userName: "John Doe",
      date: "2024-09-15",
      comment: "Great product! Highly recommend.",
      rating: 5,
    },
    {
      userName: "Jane Smith",
      date: "2024-09-14",
      comment: "Good quality, but a bit pricey.",
      rating: 4,
    },
    {
      userName: "Emily Johnson",
      date: "2024-09-13",
      comment: "Not what I expected. The product didn't match the description.",
      rating: 2,
    },
  ]);

  const [newReview, setNewReview] = useState({
    userName: "",
    comment: "",
    rating: 0,
  });

  const handleChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.userName && newReview.comment && newReview.rating) {
      setReviews([
        ...reviews,
        {
          userName: newReview.userName,
          date: new Date().toISOString().split("T")[0], // Format date as YYYY-MM-DD
          comment: newReview.comment,
          rating: parseInt(newReview.rating),
        },
      ]);
      alert(`Thank you ${newReview.userName} for your review!`)
      setNewReview({
        userName: "",
        comment: "",
        rating: 0,
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>

        {/* Review Form */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Add a Review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Name</label>
              <input
                type="text"
                name="userName"
                value={newReview.userName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Comment</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
                placeholder="Your review"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Rating</label>
              <select
                name="rating"
                value={newReview.rating}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="0">Select rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-w-xl mx-auto"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1726185600&semt=ais_hybrid"
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-lg font-semibold">{review.userName}</p>
                      <p className="text-sm text-gray-600">{formatDate(review.date)}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                  <p className="mt-2 text-gray-600">
                    Rating: <span className="font-semibold">{review.rating} / 5</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
