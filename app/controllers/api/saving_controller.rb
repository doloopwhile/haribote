class Api::SavingController < ApplicationController
  include Magick
  
  def zip
    skin = JSON.parse(params.require(:skinJSON))
    send_data(
      zip_data(skin, colors),
      filename: "skin.zip",
      type: "application/zip",
      disposition: :inline
    )
  end

  private
  
  def zip_data(skin, colors)
    buffer = Zip::OutputStream.write_buffer do |out|
      out.put_next_entry("index.json")
      out.write(index_json(skin))

      skin['layers'].each.with_index do |l, i|      
        out.put_next_entry(layer_png_name(i))
        out.write(layer_png_data(l))
      end
    end
    buffer.string    
  end

  def index_json(skin)
    layers = skin['layers'].map do |l|
      {
        file: layer_png_name(l),
        label: l['label'],
        visible: l['visible'],
        kind: l['kind']
      }
    end
    { layers: layers }.to_json
  end

  def layer_png_name(i)
    "layer_#{i}.png"
  end

  def layer_png_data(l)
    im = Image.new(64, 64)
    im.format = 'PNG'
    im.import_pixels(0, 0, 64, 64, "RGBA", l['data'])
    im.to_blob
  end
end
