"use client";

import "./Survey.css";
import Confetti from "react-confetti";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const Survey = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const confettiPortal =
    isClient &&
    showConfetti &&
    createPortal(
      <Confetti width={window.innerWidth} height={window.innerHeight} />,
      document.body,
    );

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer); // Cleanup timeout on component unmount
    }
  }, [showConfetti]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = {
      attendance: formData.get("attendance") as string,
      fullName: formData.get("full-name") as string,
      preferredDate: formData.get("preferred-date") as string,
    };

    // Validation
    if (!data.attendance || !data.fullName || !data.preferredDate) {
      setResponseMessage("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch("/next-api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ survey: JSON.stringify(data) }), // Send data as JSON string
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage("Your response has been recorded. Thank you!");
        setShowConfetti(true); // Trigger confetti on success
        form.reset(); // Clear form after submission
      } else {
        setResponseMessage(result.error || "Failed to submit your response.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResponseMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      {confettiPortal}
      <main className="p-4 bg-gray-50 min-h-screen">
        <div className="text-2xl font-bold mb-0">
          <h1>You are invited to come to Luyang&apos;s Birthday Party!</h1>
        </div>
        <div className="mb-6">
          <p>My birthday is on Christmas day.</p>
        </div>
        <div className="max-w-xl mx-auto bg-white p-6 shadow-lg rounded-lg">
          <div className="text-2xl font-bold mb-4">
            <p>
              Do you intend to come to my birthday party? (No pressure of
              course)
            </p>
          </div>
          <form
            id="birthday-survey"
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            {/* Attendance Question */}
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="yes"
                  name="attendance"
                  value="yes"
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="yes" className="text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="no"
                  name="attendance"
                  value="no"
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="no" className="text-gray-700">
                  No
                </label>
              </div>
            </div>

            {/* Full Name Question */}
            <div>
              <label htmlFor="full-name" className="block text-gray-700">
                Full Name:
              </label>
              <input
                type="text"
                id="full-name"
                name="full-name"
                className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Preferred Date Question */}
            <div>
              <p className="text-gray-700">Preferred date to come:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="date-1"
                  name="preferred-date"
                  value="23/12"
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="date-1" className="text-gray-700">
                  23/12
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="date-2"
                  name="preferred-date"
                  value="24/12"
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="date-2" className="text-gray-700">
                  24/12
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="date-3"
                  name="preferred-date"
                  value="26/12"
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="date-3" className="text-gray-700">
                  26/12
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
              >
                Submit
              </button>
            </div>
          </form>
          {responseMessage && (
            <p className="mt-4 text-center text-gray-700">{responseMessage}</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Survey;
