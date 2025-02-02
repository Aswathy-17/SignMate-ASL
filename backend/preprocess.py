from pydub import AudioSegment
import noisereduce as nr
import librosa
import soundfile as sf

def preprocess_audio(file_path, output_path="uploads/processed_audio.wav"):
    audio = AudioSegment.from_file(file_path, format="mp3")
    audio = audio.set_channels(1)
    audio = audio.set_frame_rate(16000)
    audio.export(output_path, format="mp3")
    return output_path

def reduce_noise(file_path, output_path="uploads/denoised_audio.wav"):
    y, sr = librosa.load(file_path, sr=None)
    reduced_noise = nr.reduce_noise(y=y, sr=sr)
    sf.write(output_path, reduced_noise, sr)
    return output_path
