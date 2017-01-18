Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :venues do
    get :reviews, to: 'reviews#index_for_venue'
    post :reviews, to: 'reviews#create_for_venue'
  end

  resources :reviews

end
