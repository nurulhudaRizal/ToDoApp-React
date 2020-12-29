import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Modal} from 'react-native';
import {MyColors} from '../../utils/colors';
import CheckBox from '@react-native-community/checkbox';
import {useSelector, useDispatch} from 'react-redux';
import {setTask} from '../../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const completedTask = () => {
  const taskData = useSelector((state) => state.TaskReducer);
  const dispatch = useDispatch();
  const [isModalActive, setIsModalActive] = useState(false);
  const [taskHighlight, setTaskHighlight] = useState({});
  const [selectAllTask, setSelectAllTask] = useState(false);

  useEffect(() => {
    checkIsChecklistAll();
  });

  const selectAll = () => {
    if (selectAllTask) {
      setSelectAllTask(false);
      let task = [...taskData.taskData];
      task.map((item) => {
        item.selected = false;
        return item;
      });

      changeTaskDetail(task);
      storeData(task);
    } else {
      setSelectAllTask(false);
      let task = [...taskData.taskData];
      task.map((item) => {
        item.selected = true;
        return item;
      });

      changeTaskDetail(task);
      storeData(task);
    }
  };

  const checkIsChecklistAll = useCallback(() => {
    if (taskData.taskData != null) {
      let checker = (arr) => arr.every((item) => item.selected === true);
      setSelectAllTask(checker(taskData.taskData));
    }
  }, [taskData.taskData]);

  const changeTaskDetail = (value) => {
    dispatch(setTask(value));
  };

  const deleteTask = (index) => {
    let task = [...taskData.taskData];
    task.splice(index, 1);
    changeTaskDetail(task);
    setIsModalActive(false);
    storeData(task);
  };
  const deleteSelectedTask = () => {
    let task = [...taskData.taskData];
    task.forEach((item, index) => {
      if (item.selected) {
        task.splice(index, 1);
        changeTaskDetail(task);
        storeData(task);
      }
    });
    task.forEach((item, index) => {
      if (item.selected) {
        task.splice(index, 1);
        changeTaskDetail(task);
        storeData(task);
      }
    });
    task.forEach((item, index) => {
      if (item.selected) {
        task.splice(index, 1);
        changeTaskDetail(task);
        storeData(task);
      }
    });
  };

  const selectedTask = (index, newValue) => {
    let task = [...taskData.taskData];
    task[index].selected = newValue;
    changeTaskDetail(task);
    setIsModalActive(false);
    storeData(task);
    console.log(task);
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('task', jsonValue);
    } catch (err) {
      console.log('error:' + err);
    }
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
  const MiniRectButton = ({title, color, ...rest}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          backgroundColor: color,
          width: 80,
          height: 35,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        {...rest}>
        <Text style={styles.text.miniRectButton}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    if (!item.active) {
      return (
        <View style={styles.wrapper.itemWrapper}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox
              tintColors={{true: MyColors.Blue}}
              disabled={false}
              value={item.selected}
              onValueChange={(newValue) => selectedTask(index, newValue)}
            />
            <TouchableOpacity
              style={{flex: 1, paddingHorizontal: 7.5}}
              onPress={() => {
                setTaskHighlight({...item, index});
                setIsModalActive(true);
              }}>
              <Text style={styles.text.title}>{item.title}</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.text.desc}>
                {item.desc}
              </Text>
              <Text style={styles.text.desc}>
                {new Date(item.time).toDateString()} -{' '}
                {new Date(item.time).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={{backgroundColor: MyColors.Grey, display: 'flex', flex: 1}}>
      <View style={styles.ilustration.space} />
      <View
        style={{
          flexDirection: 'row',
          padding: 15,
          backgroundColor: MyColors.White,
          elevation: 5,
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 15,
          marginVertical: 7.5,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CheckBox
            tintColors={{true: MyColors.Blue}}
            disabled={false}
            value={selectAllTask}
            onValueChange={() => selectAll()}
          />
          <Text style={styles.text.selectAll}>Select All</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MiniRectButton
            title={'Delete Selected'}
            color={MyColors.Red}
            onPress={() => {
              deleteSelectedTask();
            }}
          />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={taskData.taskData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.ilustration.space} />
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
            <Text style={styles.text.title}>{taskHighlight.title}</Text>
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.text.desc}>
              {taskHighlight.desc}
            </Text>
            <View style={styles.ilustration.space} />
            <Text style={styles.text.desc}>
              {new Date(taskHighlight.time).toDateString()} -{' '}
              {new Date(taskHighlight.time).toLocaleTimeString()}
            </Text>
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            <View style={styles.ilustration.space} />
            {/* modal button */}
            <View style={styles.wrapper.buttonModal}>
              <RectButton
                title={'Delete'}
                color={MyColors.Red}
                onPress={() => {
                  deleteTask(taskHighlight.index);
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

export default completedTask;

const styles = {
  wrapper: {
    itemWrapper: {
      backgroundColor: MyColors.White,
      borderRadius: 2,
      paddingHorizontal: 7.5,
      paddingVertical: 15,
      marginHorizontal: 15,
      marginVertical: 7.5,
      elevation: 5,
    },
    modal: {
      display: 'flex',
      flex: 1,
      backgroundColor: '#ffffff70',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    buttonModal: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
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
  },
  text: {
    title: {
      color: MyColors.BalckDark,
      fontSize: 20,
      fontWeight: 'bold',
    },
    desc: {
      color: MyColors.BalckDark,
      fontSize: 14,
    },
    selectAll: {
      color: MyColors.BalckDark,
      fontSize: 14,
      fontWeight: 'bold',
    },
    rectButton: {
      textAlign: 'center',
      fontSize: 14,
      margin: 10,
      color: MyColors.White,
      fontWeight: 'bold',
    },
    miniRectButton: {
      textAlign: 'center',
      fontSize: 12,
      margin: 10,
      color: MyColors.White,
      fontWeight: 'bold',
    },
  },
  ilustration: {
    space: {
      marginTop: 7.5,
    },
    spaceHorizontal: {
      marginLeft: 7.5,
    },
  },
};
