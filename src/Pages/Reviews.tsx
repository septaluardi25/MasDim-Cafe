import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { postReview } from "../api/reviewsApi";
import { toast } from "react-toastify";
import Header from "../Components/Header";
import kucingkopi from "../assets/kucingkopi.jpg";
import queryClient from "../lib/queryClient";

const Reviews = () => {
  const navigate = useNavigate();
  const location = useLocation();

  //ambil menuitemid dari paramater URL
  const { id } = useParams<{ id: string }>();
  const menuName = (location.state?.menuName as string | undefined) || "menu";

  const [reviewerName, setReviewerName] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const postReviewMutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      toast.success("Terimakasih atas Ulasan Anda !");
      queryClient.invalidateQueries({ queryKey: ["menu-detail", id] });
      navigate(`/menu/${id}`);
      console.log(postReviewMutation);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      toast.error("Menu tidak ditemukan");
      return;
    }
    if (!reviewerName.trim() || rating < 1 || rating > 5 || !comment.trim()) {
      toast.error("Harap isi data terlebih dahulu");
      return;
    }
    postReviewMutation.mutate({
      menuItemId: id,
      reviewerName: reviewerName.trim(),
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <Header />
      <button
        onClick={() => navigate(-1)}
        className="self-start p-5 text-amber-950 font-semibold hover:text-amber-800 cursor-pointer"
        type="button"
      >
        &larr; Back to Menu
      </button>
      <main className="grid grid-cols-1 md:grid-cols-2 my-auto px-5 py-8 container max-w-5xl ">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full  shadow-xl flex flex-col p-10 justify-between h-full rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none rounded-tr-2xl"
        >
          <div className="flex flex-col justify-center items-center">
            <h1 className=" text-amber-950 text-5xl font-extrabold">
              Thank you!
            </h1>
            <p className="font-light mb-5 mt-2 text-center">
              Please give us your Review for our {menuName}
            </p>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="reviewer"
              className="font-semibold text-amber-950"
            >
              Name
            </label>
            <input
              id="reviewer"
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="border-b border-amber-950 px-2 py-1 focus:outline-none mb-5"
            />
            <label
              htmlFor="rating"
              className="font-semibold text-amber-950"
            >
              Rating
            </label>
            <input
              id="rating"
              type="number"
              min={1}
              max={5}
              onChange={(e) => setRating(Number(e.target.value))}
              value={rating}
              className="border-b border-amber-950 px-2 py-1 focus:outline-none mb-5"
            />
            <label
              htmlFor="comment"
              className="font-semibold text-amber-950"
            >
              Comment
            </label>
            <textarea
              id="comment"
              rows={1}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              className="border-b border-amber-950 px-2 py-1 focus:outline-none mb-5 resize-none"
            />
          </div>
          <button
            className="w-full bg-amber-950 px-4 py-2 rounded-3xl text-gray-100 font-semibold hover:bg-amber-800"
            disabled={postReviewMutation.isPending}
          >
            {postReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <div className="w-full h-64 md:h-full">
          <img
            src={kucingkopi}
            alt="kucing kopi"
            className="h-full w-full object-cover rounded-bl-2xl rounded-br-2xl md:rounded-bl-none md:rounded-tr-2xl"
          />
        </div>
      </main>
    </div>
  );
};

export default Reviews;
