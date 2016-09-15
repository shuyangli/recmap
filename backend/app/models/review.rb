class Review < ApplicationRecord
  belongs_to :venue
  belongs_to :user

  enum rating: [:recommended, :mixed, :not_recommended]
end
