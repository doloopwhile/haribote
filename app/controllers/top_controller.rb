class TopController < ApplicationController
  def show
    redirect_to editor_path
  end
end
