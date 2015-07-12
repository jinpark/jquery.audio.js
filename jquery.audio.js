(function( $ ) {
 
    $.audio = function(trackListing) {
    
        // utility function for  seconds to hhmmss
        var toHHMMSS = function (time) {
            var sec_num = parseInt(time, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);
            var time = "00:00:00";

            if (hours   < 10) {hours   = "0" + hours;}
            if (minutes < 10) {minutes = "0" + minutes;}
            if (seconds < 10) {seconds = "0" + seconds;}
            if (hours == "00"){
                time = minutes + ':' + seconds;
            } else {
                time = hours + ':' + minutes + ':' + seconds;
            }
            return time;
        };

        // utility function for getting position
        var findEventPositionWithinElement = function(e) {
              var $_target = $(e.currentTarget);
              var _offset = $_target.offset();
              var _relativeX = e.pageX-_offset.left;
              var _relativeY = e.pageY-_offset.top;
              return {left: _relativeX, top: _relativeY};
        };

        var audioList = [];
        $.each(trackListing, function(index, value){
            audioList.push(new Audio(value.url));
        });

        var progress = $('progress');
        var currentElement;
        $('.play[data-song-order]').on('click', function(e){
            currentElement = this;
            var trackIndex = $(this).data('song-order')
            $(this).toggleClass('pause');
            $('.play[data-song-order]').not(this).removeClass('pause');
            var audio = audioList[$(this).data('song-order')];
            var rest = $(audioList).not(audio);
            $('.duration').text(toHHMMSS(audio.duration));
            $('.song-title').text(trackListing[trackIndex].title);
            $('.song-number').text(trackListing[trackIndex].number)
            progress.off();
            $.each(rest, function(index, value){
                value.pause();
                $(value).off('timeupdate');
            })
            if(audio.paused){
                audio.play();
                // make sure that the main button follows the small buttons
                $('.main.play').addClass('pause')
            } else {
                audio.pause();
                // make sure that the main button follows the small buttons
                $('.main.play').removeClass('pause')
            }
            $(audio).on('timeupdate', function(time){
                var duration = this.duration;
                progress[0].value = audio.currentTime/duration;
                $('.time').text(toHHMMSS(audio.currentTime));
            });
            progress.on('click', function(e){
                var _position = findEventPositionWithinElement(e);
                var _percentage = _position.left/$(this).width();
                audio.currentTime = _percentage * audio.duration;
            })
        })
        $('.main.play').on('click', function(e){
            $(currentElement).trigger('click');
        })
 
        return this;
 
    };
 
}( jQuery ));