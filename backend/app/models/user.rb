class User < ApplicationRecord
  has_many :reviews
  has_many :venues, through: :reviews
end
