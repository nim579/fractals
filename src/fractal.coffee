root = (typeof self is 'object' and self.self is self and self) or (typeof global is 'object' and global.global is global and global)

class root.Fractal
    constructor: (selector, fragment, colors)->
        $canvas = $(selector)
        @canvas = $canvas[0]
        @ctx = @canvas.getContext('2d')

        @fragment = fragment or [[1]]

        @params =
            width:  $canvas.width()
            height: $canvas.height()
            size:   @fragment.length

        @canvas.width  = @params.width
        @canvas.height = @params.height

    rgba: (r, g, b, a)->
        [r, g, b, a] = r if _.isArray r

        return "rgba(#{r or 0},#{g or 0},#{b or 0},#{a or 1})"

    clear: ->
        @ctx.clearRect 0, 0, @params.width, @params.height
        @ctx.fillStyle = @rgba(0, 0, 0, 1)
        @ctx.fillRect 0, 0, @params.width, @params.height

    draw: (callback)->
        fractal = @
        iterations = @_computeIterations()
        @fragment = @_normalizeFragment @fragment, iterations.length

        count = iterations.length

        call = (i=0)->
            setTimeout ->
                fractal.iteration 0, iterations[i], iterations, ->
                    count--
                    call i+1 if iterations[i+1]

                    callback?() if count <= 0
            , 0

        call()

    iteration: (i=0, iteration, iterations, callback)->
        fractal = @

        setTimeout ->
            j = 0
            while j <= iteration.countY
                fractal.figure i, j, iteration.size
                j++

            i++

            if i <= iteration.countX
                return fractal.iteration i, iteration, iterations, callback

            callback?()
        , 800 / iteration.countX

    figure: (iX, iY, iSize, size=@params.size)->
        pointSize = Math.floor iSize / size

        for column, i in @fragment
            for point, j in column
                @ctx.fillStyle = point
                @ctx.fillRect iX * iSize + i * pointSize,
                              iY * iSize + j * pointSize,
                              pointSize,
                              pointSize

    _computeIterations: ->
        iterations = []
        {width, height, size} = @params
        console.log width, height, size

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

    _normalizeFragment: (fragment, iterations=1)->
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
