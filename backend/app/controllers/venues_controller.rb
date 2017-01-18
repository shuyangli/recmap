class VenuesController < ApplicationController

  # GET / => index
  def index
    render json: Venue.all
  end

  # POST / => create
  def create
    # interface: { name, address, latitude, longitude }
    venue = Venue.create({
      name: params[:name],
      address: params[:address],
      latitude: params[:latitude],
      longitude: params[:longitude]
      })
    render json: venue
  end

  # GET /{id} => show
  def show
    render json: Venue.find(params[:id])
  end

  # PUT /{id} => update
  # This is idempotent: we're replace the entire object
  def update
    venue = Venue.find(params[:id])
    venue.update({
      name: params[:name],
      address: params[:address],
      latitude: params[:latitude],
      longitude: params[:longitude]
      })
    render json: venue
  end

end
