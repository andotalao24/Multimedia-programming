// This object represent the waveform generator
var WaveformGenerator = {
    // The generateWaveform function takes 4 parameters:
    //     - type, the type of waveform to be generated
    //     - frequency, the frequency of the waveform to be generated
    //     - amp, the maximum amplitude of the waveform to be generated
    //     - duration, the length (in seconds) of the waveform to be generated
    generateWaveform: function(type, frequency, amp, duration) {
        var nyquistFrequency = sampleRate / 2; // Nyquist frequency
        var totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
        var result = []; // The temporary array for storing the generated samples

        switch(type) {
           case 'sine-time': // Sine wave, time domain
console.log("sine-time");
                for (var i = 0; i < totalSamples; ++i) {
                    var currentTime = i / sampleRate;
                    result.push(amp * Math.sin(2.0 *Math.PI*frequency*currentTime));
                    //console.log(frequency);
                }
                break;

            case "square-time": // Square wave, time domain
    console.log("square-time");


                var oneCycle =sampleRate/frequency;
                var halfCycle=oneCycle/2;
                for(var i=0;i<totalSamples;i++){
                     var pos=i%parseInt(oneCycle);
                    if(pos<halfCycle)
                       result.push(amp);
                       else
                       result.push(-amp);}

                break;

            case "square-additive": // Square wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
                var totalwaves= parseInt(nyquistFrequency/frequency);
                for(var i=0;i<totalSamples;++i){
                    var currentTime= i/sampleRate;
                    var val=0;
                    for(var k=1;k<=totalwaves;k+=2){
                           val+=1/k*Math.sin(2*k*Math.PI*frequency*currentTime);
                        }
                    result.push(amp*val*4/Math.PI); //do we need to add 4/pi
                                                   //to let the value be amp?
                    }
                break;

            case "sawtooth-time": // Sawtooth wave, time domain
                /**
                * TODO: Complete this generator
                **/
                  var oneCycle = sampleRate / frequency;
                         for (var i = 0; i < totalSamples; i++) {
                                var whereInTheCycle = i % parseInt(oneCycle);
                                var fractionInTheCycle = whereInTheCycle / oneCycle;
                                result.push(
                                2*amp* (1.0 - fractionInTheCycle)-amp );//-fractionInTheCycle
                                }
                break;

            case "sawtooth-additive": // Sawtooth wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
               var totalwaves= parseInt(nyquistFrequency/frequency);
                              for(var i=0;i<totalSamples;++i){
                                  var currentTime= i/sampleRate;
                                  var val=0;
                                  for(var k=1;k<=totalwaves;k++){
                                         val+=1/k*Math.sin(2*k*Math.PI*frequency*currentTime);
                                      }
                                  result.push(amp*val*2/Math.PI);
                                  }
                break;

            case "triangle-additive": // Triangle wave, additive synthesis
                /**
                * TODO: Complete this generator
                **/
                var totalWaves = parseInt(nyquistFrequency/frequency);
                for (var i = 0; i < totalSamples; i++) {
                var t = i / sampleRate;
                var sample = 0;
                for (var k = 1; k < totalWaves * 2; k += 2) {
                sample += (1.0 / (k * k)) *
                Math.cos(2 * Math.PI * k *
                frequency * t);
                }
                result.push(amp*sample); // 8/(pi*pi)
                }

                break;

            case "karplus-strong": // Karplus-Strong algorithm
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                function prob(n){
                    return Math.random()<=n;
                }
                var base = $("#karplus-base>option:selected").val();
                var b = parseFloat($("#karplus-b").val());

                var delay;
                var useFreqq=$("#karplus-use-freq").prop("checked");

                if(useFreqq){
                delay=parseInt(sampleRate/frequency);
                    // console.log("delay:%d",delay);
                     } //samples within a period
                 else
                      {delay = parseInt($("#karplus-p").val());}
        console.log(delay);
                if(base=="white-noise"){
                    for(let i=0;i<totalSamples;i++){
                        let sample=0;
                        if(i<=delay){
                            result.push(Math.random()*(2*amp)-amp);
                            }
                        else{
                            if(prob(b)){
                           sample=0.5*(result[i-delay]+result[i-delay-1]);
                           result.push(sample);}
                            else{
                            sample=-0.5*(result[i-delay]+result[i-delay-1]);
                            result.push(sample);
                                }
                            }
                        }
                    }
                 else if(base=="sawtooth"){
                        for(let i=0;i<totalSamples;i++){
                              let sample=0;
                              if(i<=delay){
                                    let fractionInTheCycle = i / delay;
                                   result.push(2*amp* (1.0 - fractionInTheCycle)-amp );}
                              else{
                                 if(prob(b)){
                                  sample=0.5*(result[i-delay]+result[i-delay-1]);
                                  result.push(sample);}
                                  else{
                                        sample=-0.5*(result[i-delay]+result[i-delay-1]);
                                        result.push(sample);}}
                             }
                    }


                break;

            case "white-noise": // White noise
                /**
                * TODO: Complete this generator
                **/
                for(var i=0;i<totalSamples;i++){
                    result.push(Math.random()*(2*amp)-amp);
                }
                break;

            case "customized-additive-synthesis": // Customized additive synthesis
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
				var harmonics = [];
				for (var h = 1; h <= 10; ++h) {
					harmonics.push($("#additive-f" + h).val());
				}
				for(var i=0;i<totalSamples;i++){
				var t=i/sampleRate;
				    var sample=0;
				    for(var k=1;k<=10;++k){
				    if(k*frequency>nyquistFrequency)
				        break;
				    sample+=parseFloat(harmonics[k-1])*Math.sin(2*Math.PI*frequency*t*k);//1.0/k
				    }
				    result.push(sample*amp);//for the amp
				}

                break;

            case "fm": // FM
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                var carrierFrequency = parseInt($("#fm-carrier-frequency").val());
                var carrierAmplitude = parseFloat($("#fm-carrier-amplitude").val());
                var modulationFrequency = parseInt($("#fm-modulation-frequency").val());
                var modulationAmplitude = parseFloat($("#fm-modulation-amplitude").val());
                if(carrierAmplitude>amp)
                    carrierAmplitude=amp;
                var useFreq = $("#fm-use-freq-multiplier").prop("checked");
                     var mul=1;
                                if(useFreq){
                                    mul=frequency;
                                    carrierFrequency=parseFloat($("#fm-carrier-frequency").val());
                                    modulationFrequency=parseFloat($("#fm-modulation-frequency").val());}


                var useADSR = $("#fm-use-adsr").prop("checked");
                if(useADSR) { // Obtain the ADSR parameters
                    var attackDuration = parseFloat($("#fm-adsr-attack-duration").val()) * sampleRate;
                    var decayDuration = parseFloat($("#fm-adsr-decay-duration").val()) * sampleRate;
                    var releaseDuration = parseFloat($("#fm-adsr-release-duration").val()) * sampleRate;
                    var sustainLevel = parseFloat($("#fm-adsr-sustain-level").val()) / 100.0;
                    for(let i = 0; i < totalSamples; ++i) {
                                 let currentTime = i / sampleRate;
                                 let modulate=modulationAmplitude * Math.sin(2.0 *Math.PI*mul*modulationFrequency*currentTime);


                                            if(i<=attackDuration){

                                                var v1=0.0;
                                                var v2=1.0;
                                                modulate*=lerp(v1,v2,i/attackDuration);

                                            }

                                            else if(i-attackDuration>=0&& i-attackDuration<=decayDuration){
                                                 modulate*=lerp(1.0,sustainLevel,(i-attackDuration)/decayDuration);

                                            }

                                            else if(i>=totalSamples-1-releaseDuration){
                                              modulate*=lerp(sustainLevel,0.0, 1-(totalSamples-1-i)/releaseDuration);
                                            }
                                            else{
                                            modulate*=sustainLevel;}

                                      let ret=carrierAmplitude*Math.sin(2.0*Math.PI*mul*carrierFrequency*currentTime+modulate);
                                        result.push(ret);
                                        }

                }
                else{
                                for (let i = 0; i < totalSamples; ++i) {

                                           let currentTime = i / sampleRate;
                                           let  modulate=modulationAmplitude * Math.sin(2.0 *Math.PI*mul*modulationFrequency*currentTime);
                                           let ret=carrierAmplitude*Math.sin(2.0*Math.PI*mul*carrierFrequency*currentTime+modulate);
                                                    result.push(ret);
                                                }


                }

                break;

            case "repeating-narrow-pulse": // Repeating narrow pulse
                var cycle = Math.floor(sampleRate / frequency);
                for (var i = 0; i < totalSamples; ++i) {
                    if(i % cycle === 0) {
                        result.push(amp * 1.0);
                    } else if(i % cycle === 1) {
                        result.push(amp * -1.0);
                    } else {
                        result.push(0.0);
                    }
                }
                break;

            default:
                break;
        }

        return result;
    }
};
