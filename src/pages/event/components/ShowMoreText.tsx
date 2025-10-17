import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '../../../components';

interface ShowMoreTextProps {
  text: string;
  numberOfLines?: number;
}

const ShowMoreText: React.FC<ShowMoreTextProps> = ({ text, numberOfLines = 3 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <AppText style={styles.text} numberOfLines={expanded ? undefined : numberOfLines}>{text}</AppText>
      {text.length > 120 && (
        <TouchableOpacity onPress={() => setExpanded(e => !e)}>
          <AppText style={styles.showMore}>{expanded ? 'Show less' : 'Show more'}</AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#222',
    fontSize: 15,
    marginBottom: 4,
  },
  showMore: {
    color: '#0C0453',
    fontWeight: '500',
    fontSize: 15,
    marginTop: 2,
  },
});

export default ShowMoreText; 