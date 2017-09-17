class Api::SavingController < ApplicationController
  include Magick
  
  def zip
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
        { label: 'あたま', data: data, visible: true, kind: :head },
        { label: '上半身', data: data, visible: true, kind: :upper_body },
        { label: '下半身', data: data, visible: true, kind: :lower_body },
        { label: '帽子', data: data, visible: true, kind: :head_wear },
        { label: '上のふく', data: data, visible: true, kind: :upper_body_wear },
        { label: '下のふく', data: data, visible: true, kind: :lower_body_wear },
      ]
    }
  end
end
