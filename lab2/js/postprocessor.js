// This object represent the postprocessor
Postprocessor = {
    // The postprocess function takes the audio samples data and the post-processing effect name
    // and the post-processing stage as function parameters. It gathers the required post-processing
    // paramters from the <input> elements, and then applies the post-processing effect to the
    // audio samples data of every channels.
    postprocess: function(channels, effect, pass) {
        switch(effect) {
            case "no-pp":
                // Do nothing
                break;

            case "reverse":
                /**
                * TODO: Complete this function
                **/

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    var audioSequence = channels[c].audioSequenceReference;

                                        // For every sample, apply a boost multiplier
                    var n=audioSequence.data.length;
                    for(var i = 0; i <(n-1)/2; ++i) {
                          let tmp=audioSequence.data[i];
                          audioSequence.data[i]=audioSequence.data[n-1-i];
                          audioSequence.data[n-1-i]=tmp;
                                        }

                                        // Update the sample data with the post-processed data
                         channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "boost":
                // Find the maximum gain of all channels
                var maxGain = -1.0;
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;
                    var gain = audioSequence.getGain();
                    if(gain > maxGain) {
                        maxGain = gain;
                    }
                }

                // Determin the boost multiplier
                var multiplier = 1.0 / maxGain;

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    // For every sample, apply a boost multiplier
                    for(var i = 0; i < audioSequence.data.length; ++i) {
                        audioSequence.data[i] *= multiplier;
                    }

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "adsr":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var attackDuration = parseFloat($("#adsr-attack-duration").data("p" + pass)) * sampleRate;
                var decayDuration = parseFloat($("#adsr-decay-duration").data("p" + pass)) * sampleRate;
                var releaseDuration = parseFloat($("#adsr-release-duration").data("p" + pass)) * sampleRate;
                var sustainLevel = parseFloat($("#adsr-sustain-level").data("p" + pass)) / 100.0;

                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;
                   // var period=0;
                    for(var i = 0; i < audioSequence.data.length; ++i) {

                        if(i<=attackDuration){

                            var v1=0.0;
                            var v2=1.0;
                            audioSequence.data[i]*=lerp(v1,v2,i/attackDuration);
                                continue;
                        }

                        if(i-attackDuration>=0&& i-attackDuration<=decayDuration){
                             audioSequence.data[i]*=lerp(1.0,sustainLevel,(i-attackDuration)/decayDuration);
                            continue;
                        }

                        if(i>=audioSequence.data.length-1-releaseDuration){
                            audioSequence.data[i]*=lerp(sustainLevel,0.0, 1-(audioSequence.data.length-1-i)/releaseDuration);
                        }
                        else{
                        audioSequence.data[i]*=sustainLevel;}
                        // TODO: Complete the ADSR postprocessor
                        // Hinst: You can use the function lerp() in utility.js
                        // for performing linear interpolation
                        
                    }

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "tremolo":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var tremoloFrequency = parseFloat($("#tremolo-frequency").data("p" + pass));
                var wetness = parseFloat($("#tremolo-wetness").data("p" + pass));

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    for(var i = 0; i < audioSequence.data.length; ++i) {
                       let t=i/sampleRate;
                       let mul=(Math.sin(2.0 *Math.PI*tremoloFrequency*t-Math.PI/2)+1)/2*wetness+1-wetness;
                       audioSequence.data[i]*=mul;
                    }
                    // For every sample, apply a tremolo multiplier
                        channels[c].setAudioSequence(audioSequence);
                    // Update the sample data with the post-processed data
                }
                break;

            case "echo":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var delayLineDuration = parseFloat($("#echo-delay-line-duration").data("p" + pass));
                var multiplier = parseFloat($("#echo-multiplier").data("p" + pass));
                var delayLineSize=parseInt(delayLineDuration*sampleRate);
                // Post-process every channels
                for(let c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel

                    // Create a new empty delay line
                    var audioSequence = channels[c].audioSequenceReference;
                    // Get the sample data of the channel
                    for(let i = 0; i < audioSequence.data.length; ++i) {
                        // Get the echoed sample from the delay line
                        if(i<delayLineSize)
                                continue;

                        let tmp=audioSequence.data[i]+multiplier*audioSequence.data[i-delayLineSize];
                        // Add the echoed sample to the current sample, with a multiplier
                        audioSequence.data[i]=tmp;
                        // Put the current sample into the delay line
                    }
                    channels[c].setAudioSequence(audioSequence);
                    // Update the sample data with the post-processed data
                }
                break;
            
            default:
                // Do nothing
                break;
        }
        return;
    }
}
