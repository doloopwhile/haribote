class TopController < ApplicationController
  include Magick

  def show
    im = Image.read('/home/kenjiomoto/Desktop/girl_skin.png').first
    
    data = im.rows.times.flat_map { |r| 
      im.export_pixels(0, r, im.columns, 1, 'RGBA').map {|x| x / 256 }
    }
  
    @skin = {
      width: 64,
      height: 64,
      layers: [
        { data: data }
      ]
    }
  end
end
