$ ->
    colors =
        n: [0,   0,   0]
        w: [255, 255, 255]
        r: [255, 100, 100]
        g: [100, 255, 100]
        b: [100, 100, 255]
        y: [255, 255, 50]

    # figure = [
    #     [b,w,w,b]
    #     [w,b,b,w]
    #     [w,b,b,w]
    #     [b,b,b,b]
    # ]

    color = 'w'
    square = 0
    figure = []

    fractal = new Fractal '#fractal', null, [0, 0, 0, 1]
    window.fractal = fractal

    onSizeChanged = (size)->
        square = Number size

        $('.js_pixels')
        .attr 'data-size', square
        .empty()

        $('.js_size_val').text square

        pixelCount = Math.pow square, 2
        pixels = []

        figure = figure.slice 0, pixelCount

        _.forEach _.range(pixelCount), (index)->
            figure[index] = colors['n'] unless figure[index]

            pixelInput = $('<input>')
            .attr 'type', 'checkbox'
            .attr 'checked', figure[index].join(',') isnt colors['n'].join(',')
            .data 'index', index
            .addClass 'pixel__input js_pixel'

            pixel = $('<label></label>')
            .addClass 'pixel js_pixel_wrap'
            .css 'background-color', "rgb(#{figure[index].join(',')})"
            .append pixelInput

            pixels.push pixel

        $('.js_pixels').append pixels

    clearFragment = ->
        _.forEach figure, (item, index)-> figure[index] = colors['n']
        onSizeChanged square

    disableDownload = ->
        $('.js_download').attr 'disabled', true

    enableDownload = ->
        $('.js_download').attr 'disabled', false

    onSizeChanged $('.js_size')[0].value

    color = $('.js_color:checked').val()

    $('.js_color').each ->
        val = @value
        $(@).closest('.js_color_wrap').css 'background-color', "rgb(#{colors[val].join(',')})"

    $('.js_color').on 'change', ->
        color = @value

    $('.js_size').on 'change', ->
        onSizeChanged @value

    $('.js_pixels').on 'change', '.js_pixel', ->
        $el = $ @
        current = $el.data('current') or ''

        index = $el.data('index')
        rgb = if @checked then colors[color] else colors['n']

        figure[index] = rgb

        $el.closest('.js_pixel_wrap').css 'background-color', "rgb(#{figure[index].join(',')})"

    $('.js_draw').on 'click', ->
        disableDownload()

        fractal.stop()
        fractal.updateFragment _.chunk figure, square

        fractal.draw -> enableDownload()

    $('.js_clear').on 'click', ->
        disableDownload()
        clearFragment()

    $('.js_stop').on 'click', ->
        disableDownload()
        fractal.stop()

    $('.js_download').on 'click', ->
        type = 'image/png'

        fractal.getBlob type, (blob)->
            filename = 'fractal.png'

            console.log blob, filename, type
            file = new File [blob], filename, {type}

            url = URL.createObjectURL file

            pom = document.createElement 'a'
            pom.setAttribute 'href', url
            pom.setAttribute 'download', filename

            if document.createEvent
                event = document.createEvent 'MouseEvents'
                event.initEvent 'click', true, true
                pom.dispatchEvent event

            else
                pom.click()

            URL.revokeObjectURL url
