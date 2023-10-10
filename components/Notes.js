import react, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert, Keyboard } from "react-native";
import * as Style from '../assets/styles';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Icon } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Notes = ({ navigation, ...props }) => {

    const [searchNote, setSearchNote] = useState();

    function deleteNote(index) {
        let newArray = [...props.notes];
        let movedNote = newArray.splice(index, 1);
        props.setNotes(newArray);
        props.setMoveToBin(movedNote);

        let bin = [movedNote, ...props.moveToBin];
        props.setMoveToBin(bin);


        AsyncStorage.setItem('storedNotes', JSON.stringify(newArray)).then(() => {
            props.setNotes(newArray);
        }).catch(error => console.log(error))

        AsyncStorage.setItem('deletedNotes', JSON.stringify(bin)).then(() => {
            props.setMoveToBin(bin);
        }).catch(error => console.log(error))
    }


    function search() {
        if (searchNote === '') {
            Alert.alert('Type something in search box')
        } else if (searchNote !== '') {
            props.notes.forEach((item, index) => {
                if (item.includes(searchNote)) {
                    let searchItem = [...props.notes];
                    let firstElOfArray = searchItem[0];
                    let index = [...props.notes].indexOf(item);
                    searchItem[0] = item;
                    searchItem[index] = firstElOfArray;
                    props.setNotes(searchItem);
                }
            })
        }
        setSearchNote('');

        Keyboard.dismiss();
    }

    function clearAllNotes() {
        let emptyArray = [...props.notes];
        let deletedCompArray = [...props.moveToBin];
        emptyArray.forEach((item, index) => {
            deletedCompArray.push(item);
        })
        emptyArray = [];
        props.setNotes(emptyArray);
        props.setMoveToBin(deletedCompArray);


        AsyncStorage.setItem('storedNotes', JSON.stringify(emptyArray)).then(() => {
            props.setNotes(emptyArray);
        }).catch(error => console.log(error))

        AsyncStorage.setItem('deletedNotes', JSON.stringify(deletedCompArray)).then(() => {
            props.setMoveToBin(deletedCompArray);
        }).catch(error => console.log(error))
    }

    return (
        <View style={[styles.noteContainer]}>
            <View style={[styles.headingContainer]}>
                <Text style={styles.heading}>EsayNotes...</Text>
                <View style={{ flexDirection: 'row' }}>

                    <TouchableOpacity style={[styles.button, { marginLeft: 40 }]} onPress={() => navigation.navigate('DeletedNotes')}>
                        <IconRegistry icons={EvaIconsPack} />
                        <ApplicationProvider {...eva} theme={eva.light}>
                            <Icon name='trash-2-outline' fill="white" style={{ width: 25, height: 50 }} />
                        </ApplicationProvider>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button]} onPress={() => navigation.navigate('AddNote')}>
                        <IconRegistry icons={EvaIconsPack} />
                        <ApplicationProvider {...eva} theme={eva.light}>
                            <Icon name='plus-outline' fill="white" style={{ width: 25, height: 50 }} />
                        </ApplicationProvider>
                    </TouchableOpacity>

                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: 18, color: Style.color }}>
                    Total: {props.notes.length}
                </Text>
            </View>
            <View style={styles.divider}></View>

            <View style={styles.searchContainer}>
                <TextInput placeholder='Search...' placeholderTextColor={Style.color} style={[styles.input, { borderWidth: 3 }]}
                    value={searchNote} onChangeText={(text) => setSearchNote(text)} />

                <TouchableOpacity style={[styles.searchButton, { width: 50 }]} onPress={() => search()}>
                    <IconRegistry icons={EvaIconsPack} />
                    <ApplicationProvider {...eva} theme={eva.light}>
                        <Icon name='search' fill="white" style={{ width: 22, height: 40 }} />
                    </ApplicationProvider>
                </TouchableOpacity>

                <TouchableOpacity style={styles.searchButton} onPress={() => clearAllNotes()}>
                    <Text style={styles.searchButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>


            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                {props.notes.length === 0
                    ?
                    <View style={styles.emptyNoteContainer}>
                        <Text style={styles.emptyNoteText}> Click on the + button to add new note</Text>
                    </View>
                    :
                    props.notes.map((item, index) =>

                        <View style={styles.item} key={index}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={styles.note}>
                                    <Text style={styles.index}>{index + 1}.</Text>
                                    <Text style={styles.text}>{item}</Text>
                                </View>

                                <TouchableOpacity onPress={() => deleteNote(index)}>
                                    <Text style={styles.delete}>X</Text>
                                </TouchableOpacity>
                            </View>


                            <View style={styles.dateContainer}>
                                <Text>{props.date}</Text>

                                <TouchableOpacity onPress={() => navigation.navigate('EditNote', {
                                    i: index,
                                    n: item
                                })}>
                                    <Text style={styles.delete}>Edit</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    )}
            </ScrollView>
        </View>
    );
}

export const styles = StyleSheet.create({
    noteContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        marginBottom: 70,
        opacity: 0.9,
    },
    heading: {
        fontSize: 30,
        fontWeight: '700',
        color: Style.color,
    },
    divider: {
        width: "100%",
        height: 2,
        backgroundColor: Style.color,
        marginTop: 5,
        marginBottom: 5,
    },
    item: {
        marginBottom: 20,
        padding: 15,
        opacity: 0.8,
        marginTop: 10,
        backgroundColor: "#39B68D",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        // backgroundColor: Style.color,       
        borderWidth: 2,
        borderRadius: 5,
        // borderLeftColor: 5,
        color: 'black',
        shadowColor: Style.color,
    },
    index: {
        fontSize: 20,
        fontWeight: '800',
    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: Style.color,
        width: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: "center",
        marginLeft: 10,
        height: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 32,
        fontWeight: '800'
    },

    scrollView: {
        marginBottom: 70,
    },
    note: {
        flexDirection: 'row',
        width: '75%',
    },
    text: {
        fontWeight: '700',
        fontSize: 17,
        alignSelf: 'center',
    },
    delete: {
        color: Style.color,
        fontWeight: '700',
        fontSize: 15,
    },
    input: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: Style.color,
        backgroundColor: 'white',
        elevation: 5,
        shadowRadius: 8,
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: Style.color,
        opacity: 0.8,
        fontWeight: '600',
        color: 'black',
        fontSize: 19,
        width: '64%',
        paddingHorizontal: 20,
        height: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    searchButton: {
        height: 40,
        borderRadius: 5,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Style.color,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
    },
    emptyNoteContainer: {
        alignItems: 'center',
        marginTop: 240,
    },
    emptyNoteText: {
        color: Style.color,
        fontWeight: '600',
        fontSize: 17,
    },
    dateContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
})

export default Notes;