def column_to_letter(column):
    temp = 0
    letter = ""
    while column > 0:
        temp = (column - 1) % 26
        letter = chr(temp + 65) + letter
        column = (column - temp - 1) // 26

    return letter


def letter_to_column(letter):
    column = 0
    length = len(letter)
    for i in range(length):
        column += (ord(letter[i]) - 64) * pow(26, length - i - 1)

    return column
