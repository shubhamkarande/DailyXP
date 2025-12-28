import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Modal,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme';
import {
    getNotificationSettings,
    saveNotificationSettings,
    requestNotificationPermission,
} from '../services/notifications';

interface NotificationSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const TIMES = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
];

const DAYS = [
    { id: 0, label: 'Sun' },
    { id: 1, label: 'Mon' },
    { id: 2, label: 'Tue' },
    { id: 3, label: 'Wed' },
    { id: 4, label: 'Thu' },
    { id: 5, label: 'Fri' },
    { id: 6, label: 'Sat' },
];

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
    visible,
    onClose,
}) => {
    const [enabled, setEnabled] = useState(true);
    const [reminderTime, setReminderTime] = useState('09:00');
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
    const [streakReminders, setStreakReminders] = useState(true);
    const [showTimePicker, setShowTimePicker] = useState(false);

    React.useEffect(() => {
        if (visible) {
            loadSettings();
        }
    }, [visible]);

    const loadSettings = async () => {
        const settings = await getNotificationSettings();
        setEnabled(settings.enabled);
        setReminderTime(settings.dailyReminderTime);
        setSelectedDays(settings.reminderDays);
        setStreakReminders(settings.streakReminders);
    };

    const handleSave = async () => {
        if (enabled) {
            const hasPermission = await requestNotificationPermission();
            if (!hasPermission) {
                setEnabled(false);
            }
        }

        await saveNotificationSettings({
            enabled,
            dailyReminderTime: reminderTime,
            reminderDays: selectedDays,
            streakReminders,
        });

        onClose();
    };

    const toggleDay = (dayId: number) => {
        setSelectedDays(prev =>
            prev.includes(dayId)
                ? prev.filter(d => d !== dayId)
                : [...prev, dayId],
        );
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color={colors.text.muted} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Reminder Settings</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Enable/Disable */}
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Icon name="notifications" size={24} color={colors.primary.DEFAULT} />
                            <Text style={styles.rowLabel}>Daily Reminders</Text>
                        </View>
                        <Switch
                            value={enabled}
                            onValueChange={setEnabled}
                            trackColor={{ false: colors.surface.border, true: colors.primary.DEFAULT }}
                            thumbColor="#fff"
                        />
                    </View>

                    {enabled && (
                        <>
                            {/* Time Picker */}
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => setShowTimePicker(true)}>
                                <View style={styles.rowLeft}>
                                    <Icon name="schedule" size={24} color={colors.primary.DEFAULT} />
                                    <Text style={styles.rowLabel}>Reminder Time</Text>
                                </View>
                                <View style={styles.timeValue}>
                                    <Text style={styles.timeText}>{formatTime(reminderTime)}</Text>
                                    <Icon name="chevron-right" size={20} color={colors.text.muted} />
                                </View>
                            </TouchableOpacity>

                            {/* Day Selector */}
                            <View style={styles.daysSection}>
                                <Text style={styles.sectionLabel}>REMIND ME ON</Text>
                                <View style={styles.daysRow}>
                                    {DAYS.map(day => (
                                        <TouchableOpacity
                                            key={day.id}
                                            style={[
                                                styles.dayButton,
                                                selectedDays.includes(day.id) && styles.dayButtonActive,
                                            ]}
                                            onPress={() => toggleDay(day.id)}>
                                            <Text
                                                style={[
                                                    styles.dayText,
                                                    selectedDays.includes(day.id) && styles.dayTextActive,
                                                ]}>
                                                {day.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Streak Reminders */}
                            <View style={styles.row}>
                                <View style={styles.rowLeft}>
                                    <Icon name="local-fire-department" size={24} color={colors.accent.orange} />
                                    <Text style={styles.rowLabel}>Streak at Risk Alerts</Text>
                                </View>
                                <Switch
                                    value={streakReminders}
                                    onValueChange={setStreakReminders}
                                    trackColor={{ false: colors.surface.border, true: colors.accent.orange }}
                                    thumbColor="#fff"
                                />
                            </View>
                        </>
                    )}

                    {/* Time Picker Modal */}
                    <Modal visible={showTimePicker} transparent animationType="fade">
                        <TouchableOpacity
                            style={styles.timePickerOverlay}
                            onPress={() => setShowTimePicker(false)}>
                            <View style={styles.timePicker}>
                                <Text style={styles.timePickerTitle}>Select Time</Text>
                                <FlatList
                                    data={TIMES}
                                    keyExtractor={item => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.timeOption,
                                                item === reminderTime && styles.timeOptionActive,
                                            ]}
                                            onPress={() => {
                                                setReminderTime(item);
                                                setShowTimePicker(false);
                                            }}>
                                            <Text
                                                style={[
                                                    styles.timeOptionText,
                                                    item === reminderTime && styles.timeOptionTextActive,
                                                ]}>
                                                {formatTime(item)}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.card.dark,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary.DEFAULT,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface.border,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    timeValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary.DEFAULT,
    },
    daysSection: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface.border,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
        letterSpacing: 1,
        marginBottom: 12,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.surface.border,
    },
    dayButtonActive: {
        backgroundColor: colors.primary.DEFAULT,
        borderColor: colors.primary.DEFAULT,
    },
    dayText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.muted,
    },
    dayTextActive: {
        color: '#fff',
    },
    timePickerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timePicker: {
        width: '80%',
        maxHeight: 400,
        backgroundColor: colors.card.dark,
        borderRadius: 20,
        padding: 20,
    },
    timePickerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
        textAlign: 'center',
    },
    timeOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    timeOptionActive: {
        backgroundColor: 'rgba(127, 19, 236, 0.2)',
    },
    timeOptionText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    timeOptionTextActive: {
        color: colors.primary.DEFAULT,
        fontWeight: '700',
    },
});

export default NotificationSettingsModal;
