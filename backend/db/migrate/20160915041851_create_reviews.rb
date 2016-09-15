class CreateReviews < ActiveRecord::Migration[5.0]
  def change
    create_table :reviews do |t|
      t.integer :rating
      t.date :date
      t.belongs_to :venue, index: true
      t.belongs_to :user, index: true

      t.timestamps
    end
  end
end
