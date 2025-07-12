import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ShowMoreTextProps {
  text: string;
  numberOfLines?: number;
}

const ShowMoreText: React.FC<ShowMoreTextProps> = ({ text, numberOfLines = 3 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <Text style={styles.text} numberOfLines={expanded ? undefined : numberOfLines}>{text}</Text>
      {text.length > 120 && (
        <TouchableOpacity onPress={() => setExpanded(e => !e)}>
          <Text style={styles.showMore}>{expanded ? 'Show less' : 'Show more'}</Text>
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