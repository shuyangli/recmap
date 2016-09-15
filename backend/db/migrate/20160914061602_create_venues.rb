class CreateVenues < ActiveRecord::Migration[5.0]
  def change
    create_table :venues do |t|
      t.string :name, null: false
      t.string :address, null: false
      t.decimal :latitude, precision: 15, scale: 13
      t.decimal :longitude, precision: 15, scale: 13

      t.timestamps
    end
  end
end
