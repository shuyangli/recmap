require 'active_support'

class ReviewsController < ApplicationController

  # GET / => index
  def index
    render json: Review.all
  end

  def index_for_venue
    render json: Venue.find(params[:venue_id]).reviews
  end

  # POST / => create
  def create
    # interface: { id, rating, date, venue_id, user_id }
    # TODO (shuyang): figure out auth & get user id
    review = Review.create({
      rating: params[:rating],
      notes: params[:notes],
      date: if params[:date] then params[:date] else Date.today end,
      address: params[:address]
      })
    render json: review
  end

  def create_for_venue
    review = Venue.find(params[:venue_id]).reviews.create({
      rating: params[:rating],
      notes: params[:notes],
      date: if params[:date] then params[:date] else Date.today end,
      address: params[:address]
      })
    render json: review
  end

  # GET /{id} => show
  def show
    render json: Review.find(params[:id])
  end

  # PUT /{id} => update
  # This is idempotent: we're replace the entire object
  def update
    review = Review.find(params[:id])
    review.update({
      rating: params[:rating],
      notes: params[:notes],
      date: if params[:date] then params[:date] else Date.today end,
      address: params[:address]
      })
    render json: review
  end

end
