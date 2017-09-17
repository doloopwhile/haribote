class Api::ParsingController < ApplicationController
  include Magick
  
  def png
    f = params.require(:file)
    render json: { skin: skin_from_png(f.read) }
  end

  private
  
  def skin_from_png(png_data)
    im = Image.read_inline(Base64.encode64(png_data)).first

    data = im.rows.times.flat_map { |r| 
      im.export_pixels(0, r, im.columns, 1, 'RGBA').map {|x| x / 256 }
    }

    {
      width: 64,
      height: 64,
      layers: [
        { label: 'Head', data: data, visible: true, kind: :head },
        { label: 'Arms', data: data, visible: true, kind: :arms },
        { label: 'Body', data: data, visible: true, kind: :body },
        { label: 'Legs', data: data, visible: true, kind: :legs },

        { label: 'Head wear', data: data, visible: true, kind: :head_wear },
        { label: 'Arms wear', data: data, visible: true, kind: :arms_wear },
        { label: 'Body wear', data: data, visible: true, kind: :body_wear },
        { label: 'Legs wear', data: data, visible: true, kind: :legs_wear },
      ]
    }
  end
end
