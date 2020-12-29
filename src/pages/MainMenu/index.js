import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import {MyColors} from '../../utils/colors';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DateTimePicker from '@react-native-community/datetimepicker';
import onGoingTask from './onGoingTask';
import completedTask from './completedTask';
import {plusIcon} from '../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {setTask} from '../../redux';

const Tab = createMaterialTopTabNavigator();

const MainMenu = () => {
  const taskData = useSelector((state) => state.TaskReducer);
  const dispatch = useDispatch();

  const changeTaskDetail = (value) => {
    dispatch(setTask(value));
  };

  useEffect(() => {
    getTaskData();
  }, [getTaskData]);

  const getTaskData = async () => {
    try {
      const task = await AsyncStorage.getItem('task');
      const Task = JSON.parse(task);

      changeTaskDetail(Task);
      console.log(Task);
    } catch (e) {
      // read error
      console.log('err.');
    }
  };

  const [isModalActive, setIsModalActive] = useState(false);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  //const [taskData, setTaskData] = useState([]);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    desc: '',
    time: new Date(),
    active: true,
    selected: false,
  });

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newTaskData.time;
    setShow(Platform.OS === 'ios');
    setNewTaskData({...newTaskData, time: currentDate});
  };

  const onInputChange = (value, inputType) => {
    setNewTaskData({
      ...newTaskData,
      [inputType]: value,
    });
  };

  const addTask = () => {
    if (taskData.taskData != null) {
      let task = [...taskData.taskData];
      task.push({id: task.length + 1, ...newTaskData});
      changeTaskDetail(task);
      setIsModalActive(false);
      storeData(task);
    } else {
      let task = [];
      task.push({id: task.length + 1, ...newTaskData});
      changeTaskDetail(task);
      setIsModalActive(false);
      storeData(task);
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('task', jsonValue);
    } catch (err) {
      console.log('error:' + err);
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const AddNewTaskButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          backgroundColor: MyColors.Blue,
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 30,
          elevation: 4,
        }}
        onPress={() => {
          setNewTaskData({
            title: '',
            desc: '',
            time: new Date(),
            active: true,
            selected: false,
          });
          setIsModalActive(true);
        }}>
        <Image source={plusIcon} style={{width: 20, height: 20}} />
      </TouchableOpacity>
    );
  };

  const RectButton = ({title, color, ...rest}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          backgroundColor: color,
          width: 100,
          height: 40,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        {...rest}>
        <Text style={styles.text.rectButton}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper.main}>
      <Tab.Navigator tabBarOptions={styles.tabBarOptions}>
        <Tab.Screen name="on Going Task" component={onGoingTask} />
        <Tab.Screen name="completed Task" component={completedTask} />
      </Tab.Navigator>
      <AddNewTaskButton />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={newTaskData.time}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      {/* modal picker */}
      <Modal
        transparent={true}
        visible={isModalActive}
        animationType={'slide'}
        onRequestClose={() => {
          setIsModalActive(false);
        }}>
        <View style={styles.wrapper.modal}>
          <View style={styles.wrapper.itemModal}>
            {/* modal title */}
            <Text style={styles.text.modalTitle}>Add New Task</Text>
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            {/* title task input */}
            <TextInput
              style={styles.wrapper.titleInput}
              placeholder="Title"
              value={newTaskData.title}
              onChangeText={(value) => {
                onInputChange(value, 'title');
              }}
            />
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            {/* desc task input */}
            <TextInput
              style={styles.wrapper.descInput}
              placeholder="Desc"
              multiline={true}
              value={newTaskData.desc}
              onChangeText={(value) => {
                onInputChange(value, 'desc');
              }}
            />
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            {/* date picker */}
            <View style={styles.wrapper.buttonModal}>
              <View style={styles.wrapper.date}>
                <Text style={styles.text.desc}>
                  {newTaskData.time.toDateString()}
                </Text>
              </View>
              <RectButton
                title={'Select Date'}
                color={MyColors.Blue}
                onPress={() => {
                  showDatepicker();
                }}
              />
            </View>
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            {/* time picker */}
            <View style={styles.wrapper.buttonModal}>
              <View style={styles.wrapper.date}>
                <Text style={styles.text.desc}>
                  {newTaskData.time.toLocaleTimeString()}
                </Text>
              </View>
              <RectButton
                title={'Select Time'}
                color={MyColors.Blue}
                onPress={() => {
                  showTimepicker();
                }}
              />
            </View>
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            {/* modal button */}
            <View style={styles.wrapper.buttonModal}>
              <RectButton
                title={'Add'}
                color={MyColors.Blue}
                onPress={() => {
                  addTask();
                }}
              />
            </View>
            <View style={styles.ilustration.space} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MainMenu;

const styles = {
  wrapper: {
    main: {display: 'flex', flex: 1},
    modal: {
      display: 'flex',
      flex: 1,
      backgroundColor: '#ffffff70',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    itemModal: {
      width: '100%',
      paddingVertical: 15,
      marginTop: 'auto',
      backgroundColor: MyColors.White,
      borderRadius: 20,
      alignItems: 'center',
      elevation: 20,
    },
    buttonModal: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    titleInput: {
      width: '85%',
      height: 40,
      paddingHorizontal: 13,
      borderWidth: 2,
      borderRadius: 4,
      borderColor: MyColors.Blue,
      fontSize: 15,
      backgroundColor: MyColors.Grey,
      color: MyColors.BalckDark,
    },
    descInput: {
      width: '85%',
      height: 80,
      paddingHorizontal: 13,
      borderWidth: 2,
      borderRadius: 4,
      borderColor: MyColors.Blue,
      fontSize: 15,
      backgroundColor: MyColors.Grey,
      color: MyColors.BalckDark,
    },
    date: {
      backgroundColor: MyColors.Grey,
      width: 200,
      height: 40,
      borderWidth: 2,
      borderRadius: 4,
      borderColor: MyColors.Blue,
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  text: {
    modalTitle: {
      color: MyColors.BalckDark,
      fontSize: 20,
      fontWeight: 'bold',
    },
    rectButton: {
      fontSize: 14,
      margin: 10,
      color: MyColors.White,
      fontWeight: 'bold',
    },
    desc: {
      color: MyColors.BalckDark,
      fontSize: 15,
    },
  },
  ilustration: {
    space: {
      marginTop: 7.5,
    },
  },
  tabBarOptions: {
    activeTintColor: MyColors.BalckDark,
    labelStyle: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    indicatorStyle: {backgroundColor: MyColors.Blue},
  },
};
