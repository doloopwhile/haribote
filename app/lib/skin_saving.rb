module SkinSaving
  class << self
    include Magick
  
    def zip_data_from_skin(skin)
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

    private

    def index_json(skin)
      layers = skin['layers'].map.with_index do |l, i|
        {
          file: layer_png_name(i),
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
      im.format = "PNG"
      im = im.import_pixels(0, 0, 64, 64, "RGBA", l['data'].map { |x| x * 256 })
      im.to_blob
    end
  end
end