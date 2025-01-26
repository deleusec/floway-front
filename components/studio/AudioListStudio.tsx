import { ScrollView, StyleSheet, View } from "react-native";
import AudioCard from "../cards/AudioCard";
import { ThemedText } from "../text/ThemedText";

export default function AudioListStudio({ audioList, selectedAudio, openAudioEditModal, goalType }: any) {
  return (

    <ScrollView
    showsVerticalScrollIndicator={false}
    style={styles.audioList}
    contentContainerStyle={styles.audioListContent}>
    <View style={styles.audioListContent}>
      {audioList.length > 0 ? (
        audioList.map((audio: any) => (
          <AudioCard
            key={audio.id}
            id={audio.id}
            title={audio.title}
            duration={Math.round(Number(audio.duration))}
            goalType={goalType}
            start_time={audio.start_time}
            start_distance={audio.start_distance?.toString()}
            isSelected={selectedAudio?.id === audio.id}
            onPress={() => openAudioEditModal(audio)}
          />
        ))
      ) : (
        <ThemedText type="legend" style={styles.emptyMessage}>
          Aucun audio n’a été ajouté. Créez ou importez le votre en cliquant ci-dessous !
        </ThemedText>
      )}
    </View>
  </ScrollView>
  )
}


const styles = StyleSheet.create({
  audioList: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  audioListContent: {
    paddingBottom: 30,
    paddingTop: 10,
    gap: 10,
  },
  emptyMessage: {
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
