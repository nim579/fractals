root = (typeof self is 'object' and self.self is self and self) or (typeof global is 'object' and global.global is global and global)

class root.Fractal
    constructor: (selector, fragment, bg = [0,0,0,0])->
        $canvas = $(selector)
        @canvas = $canvas[0]
        @ctx = @canvas.getContext('2d')

        @fragment = fragment or [[1]]

        @params =
            width:  $canvas.width()
            height: $canvas.height()
            size:   @fragment.length
            bg:     bg

        @canvas.width  = @params.width
        @canvas.height = @params.height

        @clear()

    updateFragment: (fragment)->
        @fragment = fragment or [[1]]
        @params.size = @fragment.length

    getBlob: (type = 'image/png', callback)->
        @canvas.toBlob callback, type

    rgba: (r, g, b, a)->
        [r, g, b, a] = r if _.isArray r
        return "rgba(#{r or 0},#{g or 0},#{b or 0},#{a or 1})"

    clear: ->
        @ctx.clearRect 0, 0, @params.width, @params.height
        @ctx.fillStyle = @rgba @params.bg
        @ctx.fillRect 0, 0, @params.width, @params.height

    draw: (callback)->
        fractal = @
        iterations = @_computeIterations()
        @fragment = @_normalizeFragment @fragment, iterations.length

        count = iterations.length

        @stop()
        @clear()

        call = (i = 0)->
            fractal._drawTO = setTimeout ->
                fractal.iteration 0, iterations[i], iterations, ->
                    count--
                    call i + 1 if iterations[i + 1]

                    callback? fractal.canvas if count <= 0
            , 0

        call()

    stop: ->
        clearTimeout @_drawTO if @_drawTO
        clearTimeout @_iterateTO if @_iterateTO

    iteration: (i = 0, iteration, iterations, callback)->
        fractal = @

        fractal._iterateTO = setTimeout ->
            j = 0
            while j <= iteration.countY
                fractal.figure i, j, iteration.size
                j++

            i++

            if i <= iteration.countX
                return fractal.iteration i, iteration, iterations, callback

            callback?()
        , 400 / iteration.countX

    figure: (iX, iY, iSize, size = @params.size)->
        pointSize = Math.floor iSize / size

        for column, i in @fragment
            for point, j in column
                @ctx.fillStyle = point
                @ctx.fillRect iX * iSize + j * pointSize,
                              iY * iSize + i * pointSize,
                              pointSize,
                              pointSize

    _computeIterations: ->
        iterations = []
        {width, height, size} = @params

        addIter = ->
            countX = Math.floor width  / size
            countY = Math.floor height / size

            if countX > 0 and countY > 0
                iterations.push {size, countX, countY}
                size *= 2

                addIter()

            else
                return iterations

        addIter()

        return iterations

    _normalizeFragment: (fragment, iterations = 1)->
        alpha = (1 / iterations).toFixed(2)

        normal = _.map fragment, (column)=>
            return _.map column, (point)=>
                if _.isArray point
                    color = point.slice(0, 3)
                    color.push alpha

                else if point
                    color = [255, 255, 255, alpha]

                else
                    color = [0, 0, 0, alpha]

                return @rgba color

        return normal
