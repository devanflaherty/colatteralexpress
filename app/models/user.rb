class User < ApplicationRecord
  has_many :projects
  has_many :comments, as: :author

  def full_name
    "#{first_name} #{last_name}"
  end

  scope :agency, -> { where(:branch => 'ZoomPop') }
  scope :sorted, -> { order(:email => "ASC") }
  scope :newest_first, -> { order(:created_at => "DESC") }
  scope :search, -> (query) {where(["email LIKE ?", "%#{query}%"])}

end