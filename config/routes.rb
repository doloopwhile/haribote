Rails.application.routes.draw do
  root to: 'top#show'

  resource :editor, only: [:new, :create] do
    post :zip
    post :png
  end
end
