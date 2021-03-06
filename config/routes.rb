Rails.application.routes.draw do
  root 'app#index'

  ##-------------------------------------------------------##
  ## API Resources                                         ##
  ##-------------------------------------------------------##
  namespace :api do
    namespace :v1 do
      post 'user_token' => 'user_token#create'
      get 'user' => 'authenticate#index'
      resources :users, :except => [:new, :edit]
      put 'users' => 'users#update'
      resources :contacts
      resources :projects

      resources :media, only: [:create, :delete, :destroy]
    end
  end

  ##-------------------------------------------------------##
  ## Custom Routes                                         ##
  ##-------------------------------------------------------##
  # post 'contacts/clear', to: 'contacts#clear', method: :post
  # post 'contacts/login', to: 'contacts#login', method: :post

  ##-------------------------------------------------------##
  ## Route to enable Vue Routes                            ##
  ##-------------------------------------------------------##
  get '*path', to: 'app#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

  # Default route : Try not to use
  # get ':controller(/:action(:id))'
end
