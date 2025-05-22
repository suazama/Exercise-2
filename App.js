import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

const getIconName = (dir) => {
  switch (dir.toLowerCase()) {
    case 'work':
      return 'work';
    case 'personal':
      return 'person';
    case 'shopping list':
      return 'shopping-cart';
    case 'ideas':
      return 'lightbulb';
    default:
      return 'folder';
  }
};

const HomeScreen = ({ navigation }) => {
  const [directories, setDirectories] = useState([
    'Work',
    'Personal',
    'Shopping List',
    'Ideas',
  ]);
  const [newDir, setNewDir] = useState('');
  const [messages, setMessages] = useState({});

  const addDirectory = () => {
    const dirName = newDir.trim();
    if (!dirName) return Alert.alert('Please enter a directory name');
    if (directories.includes(dirName)) return Alert.alert('Directory already exists');

    setDirectories([...directories, dirName]);
    setNewDir('');
  };

  const deleteDirectory = (dirName) => {
    Alert.alert('Delete Directory', `Are you sure you want to delete "${dirName}"?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setDirectories(directories.filter((d) => d !== dirName));
          const updatedMessages = { ...messages };
          delete updatedMessages[dirName];
          setMessages(updatedMessages);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Message Directories</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={newDir}
          onChangeText={setNewDir}
          placeholder="New directory name"
        />
        <Button title="Add" onPress={addDirectory} />
      </View>

      <FlatList
        data={directories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.directoryRow}>
            <TouchableOpacity
              style={styles.directory}
              onPress={() =>
                navigation.navigate('Message', {
                  dirName: item,
                  savedMessage: messages[item] || '',
                  onSave: (msg) => {
                    setMessages({ ...messages, [item]: msg });
                  },
                })
              }
            >
              <View style={styles.iconRow}>
                <MaterialIcons
                  name={getIconName(item)}
                  size={24}
                  color="#333"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.dirText}>{item}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteDirectory(item)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const MessageScreen = ({ route, navigation }) => {
  const { dirName, savedMessage, onSave } = route.params;
  const [message, setMessage] = useState(savedMessage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dirName}</Text>
      <TextInput
        style={styles.messageBox}
        multiline
        placeholder="Write your message here..."
        value={message}
        onChangeText={setMessage}
      />
      <Button
        title="Save Note"
        onPress={() => {
          onSave(message);
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Message" component={MessageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  directoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directory: {
    flex: 1,
    backgroundColor: '#e0f0ff',
    padding: 15,
    borderRadius: 5,
  },
  dirText: { fontSize: 18 },
  deleteButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#ffcccc',
    borderRadius: 5,
  },
  deleteText: { color: 'red', fontWeight: 'bold' },
  messageBox: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 15,
    minHeight: 200,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
});
