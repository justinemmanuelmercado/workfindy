import { getSimilarStrings } from './filters';

describe('getSimilarStrings', () => {
  it('returns an empty array when there are no matching strings', () => {
    const strings = ['foo', 'bar', 'baz'];
    const match = 'qux';

    const matches = getSimilarStrings(strings, match);

    expect(matches).toEqual([]);
  });

  it('returns an empty array when the match is an empty string', () => {
    const strings = ['foo', 'bar', 'baz'];
    const match = '';

    const matches = getSimilarStrings(strings, match);

    expect(matches).toEqual([]);
  });

  it('returns an empty array when the strings are empty', () => {
    const strings: string[] = [];
    const match = 'foo';

    const matches = getSimilarStrings(strings, match);

    expect(matches).toEqual([]);
  });

  it('returns a single match when there is one match', () => {
    const strings = ['foo', 'bar', 'baz'];
    const match = 'foo';

    const matches = getSimilarStrings(strings, match);
    expect(matches).toEqual([{ string: 'foo', snippet: 'foo' }]);
  });

  it('returns multiple matches when there are multiple matches with multiple words', () => {
    const strings = ['foo', 'bar', 'baz'];
    const match = 'foo bar';

    const matches = getSimilarStrings(strings, match);
    expect(matches).toEqual([
      { string: 'foo', snippet: 'foo' },
      { string: 'bar', snippet: 'bar' },
      { string: 'baz', snippet: 'bar' },
    ]);
  });

  it('returns multiple matches when there are multiple matches with multiple words and some that are not', () => {
    const strings = ['foo', 'bar', 'baz'];
    const match = 'foo bar qux';

    const matches = getSimilarStrings(strings, match);

    expect(matches).toEqual([
      { string: 'foo', snippet: 'foo' },
      { string: 'bar', snippet: 'bar' },
      { string: 'baz', snippet: 'bar' },
    ]);
  });
});
