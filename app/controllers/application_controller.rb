class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  after_action :put_flash_to_gon

  private

  def put_flash_to_gon
    # gon.flash = flash.to_hash
  end
end
