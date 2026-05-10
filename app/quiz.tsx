import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { ProgressChart } from 'react-native-chart-kit';

import { getQuizByAnimalId,submitAnswer } from '@/services/quizService';

import Toast from 'react-native-toast-message';
import { QuizOption, QuizQuestion } from '@/types/quiz';

interface ParsedQuestion extends Omit<QuizQuestion, 'options'> {
  parsedOptions: QuizOption[];
}

export default function Quiz() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const navigate = useRouter();

  const { id } = route.params;

  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [hits, setHits] = useState(0);
  const [fails, setFails] = useState(0);

  const [finished, setFinished] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [answerResult, setAnswerResult] = useState<
    'correct' | 'incorrect' | null
  >(null);

  const [counter, setCounter] = useState(-1);

  const [answerDetails, setAnswerDetails] = useState('');

  const sendError = (message: string) => {
    Toast.show({
      type: 'error',
      text1: message,
    });
  };

  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);

        const data = await getQuizByAnimalId(Number(id));

        const parsed = data.map((q: QuizQuestion) => {
          let parsedOptions: QuizOption[] = [];

          try {
            parsedOptions = JSON.parse(q.options);
          } catch {
            console.error('Erro ao converter opções', q.code);
          }

          return {
            ...q,
            parsedOptions,
          };
        });

        setQuestions(parsed);
      } catch (err: any) {
        console.log(err)
        if (err.status === 401 || err.status === 422) {
          sendError('É necessário fazer login para jogar o quiz.');
          navigate.push("/profile")
        } else {
          setError(err.message || 'Erro ao carregar quiz.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [id]);

  const handleAnswer = async (optionId: number) => {
    if (submitting || answerResult) return;

    setSelectedOption(optionId);
    setSubmitting(true);

    const currentQuestion = questions[currentIndex];

    let timeout = 4000;

    try {
      const response = await submitAnswer({
        questionCode: currentQuestion.code,
        userAnswer: optionId,
      });

      const isCorrect = response?.isAnswerRight === true;

      if (isCorrect) {
        setHits((h) => h + 1);
        setAnswerResult('correct');
      } else {
        setFails((f) => f + 1);
        setAnswerResult('incorrect');

        setAnswerDetails(
          response.answerDetails
            ? `Detalhes da resposta: ${response.answerDetails}`
            : '',
        );

        timeout = 10000;
      }

      counterDown(Math.floor(timeout / 1000));
      changeToNextQuestion(timeout);
    } catch {
      setFails((f) => f + 1);
      setAnswerResult('incorrect');

      counterDown(Math.floor(timeout / 1000));
      changeToNextQuestion(timeout);
    }
  };

  const changeToNextQuestion = (timeout: number) => {
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setAnswerResult(null);
      } else {
        setFinished(true);
      }

      setSubmitting(false);
      setAnswerDetails('');
    }, timeout);
  };

  const counterDown = (start: number) => {
    setCounter(start);

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const defineMessageCounter = () => {
    if (currentIndex === questions.length - 1 && counter !== -1) {
      return `Resultados em ${counter}`;
    }

    if (counter > 0) {
      return `Próxima pergunta em ${counter}`;
    }

    return '';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A5D23" />
        <Text style={styles.loadingText}>Carregando quiz... 🌿</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Erro</Text>

        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigate.push("/")}
        >
          <Text style={styles.primaryButtonText}>
            Voltar para Home
          </Text>
        </Pressable>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Nenhuma pergunta encontrada
        </Text>

        <Text style={styles.errorText}>
          Aguarde novas perguntas.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigate.push("/")}
        >
          <Text style={styles.primaryButtonText}>
            Voltar para Home
          </Text>
        </Pressable>
      </View>
    );
  }

  if (finished) {
    const total = hits + fails;

    const hitPercentage =
      total > 0 ? Math.round((hits / total) * 100) : 0;

    return (
      
      <ScrollView contentContainerStyle={styles.center}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>
            Resultado do Quiz
          </Text>

          <ProgressChart
            data={{
              labels: ['Acertos'],
              data: [hitPercentage / 100],
            }}
            width={250}
            height={220}
            strokeWidth={16}
            radius={42}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: () => '#4A5D23',
            }}
            hideLegend
          />

          <Text style={styles.percentText}>
            {hitPercentage}%
          </Text>

          <View style={styles.resultTags}>
            <View style={[styles.tag, { backgroundColor: 'green' }]}>
              <Text style={styles.tagText}>
                Acertos: {hits}
              </Text>
            </View>

            <View style={[styles.tag, { backgroundColor: '#D38345' }]}>
              <Text style={styles.tagText}>
                Erros: {fails}
              </Text>
            </View>
          </View>

          <Text style={styles.resultMessage}>
            {hitPercentage >= 70
              ? 'Ótimo trabalho! Você conhece bem nossa fauna!'
              : 'Continue aprendendo sobre nossos animais!'}
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => navigate.push("/")}
          >
            <Text style={styles.primaryButtonText}>
              Voltar para Home
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        É hora de praticar!
      </Text>

      <Text style={styles.counter}>
        {defineMessageCounter()}
      </Text>

      <View style={styles.card}>
        <Text style={styles.questionCounter}>
          Pergunta {currentIndex + 1} de {questions.length}
        </Text>

        <Text style={styles.question}>
          {currentQuestion.statement}
        </Text>

        {currentQuestion.parsedOptions.map((option) => {
          const isSelected = selectedOption === option.id;

          let backgroundColor = '#fff';
          let borderColor = '#FBC02D';

          if (isSelected && answerResult === 'correct') {
            backgroundColor = '#4A5D23';
            borderColor = '#4A5D23';
          }

          if (isSelected && answerResult === 'incorrect') {
            backgroundColor = '#D38345';
            borderColor = '#D38345';
          }

          return (
            <Pressable
              key={option.id}
              style={[
                styles.optionButton,
                {
                  backgroundColor,
                  borderColor,
                },
              ]}
              disabled={submitting || answerResult !== null}
              onPress={() => handleAnswer(option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? '#fff' : '#333',
                  },
                ]}
              >
                {option.value}
              </Text>

              {isSelected && answerResult === 'correct' && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#fff"
                />
              )}

              {isSelected && answerResult === 'incorrect' && (
                <Ionicons
                  name="close-circle"
                  size={24}
                  color="#fff"
                />
              )}
            </Pressable>
          );
        })}
      </View>

      {!!answerDetails && (
        <Text style={styles.answerDetails}>
          {answerDetails}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
container: {
  flexGrow: 1,
  padding: 20,
  paddingBottom: 40,
  justifyContent: 'center',
},

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#5D4037',
    marginBottom: 10,
  },

  counter: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
    color: '#5D4037',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#5D4037',
    borderRadius: 16,
    padding: 20,
  },

  questionCounter: {
    color: '#D38345',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5D4037',
    textAlign: 'center',
    marginBottom: 24,
  },

  optionButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },

  answerDetails: {
    marginTop: 20,
    textAlign: 'center',
    color: '#5D4037',
    fontSize: 16,
    fontWeight: '600',
  },

  errorTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B0000',
    marginBottom: 12,
  },

  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  primaryButton: {
    backgroundColor: '#4A5D23',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  resultCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },

  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5D4037',
    marginBottom: 20,
  },

  percentText: {
    marginTop: -40,
    fontSize: 32,
    fontWeight: '700',
    color: '#5D4037',
  },

  resultTags: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
  },

  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  tagText: {
    color: '#fff',
    fontWeight: '700',
  },

  resultMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#5D4037',
    fontWeight: '600',
  },
});