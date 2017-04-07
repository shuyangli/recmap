class AddNoteToReviews < ActiveRecord::Migration[5.0]
  def change
    add_column :reviews, :notes, :string
  end
end
