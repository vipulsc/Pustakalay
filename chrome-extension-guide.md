# Testing APIs with Keploy Chrome Extension - Complete Guide

## Overview

This guide will walk you through testing APIs using the Keploy Chrome extension on real websites. We'll test at least two different websites that make API calls and demonstrate how AI-powered testing can capture and validate API interactions automatically.

## Prerequisites

1. **Chrome Browser**: Latest version
2. **Keploy Chrome Extension**: Install from Chrome Web Store
3. **Basic understanding of APIs**: HTTP methods, status codes, JSON

## Installation

### Step 1: Install Keploy Chrome Extension

1. Open Chrome and go to the Chrome Web Store
2. Search for "Keploy API Testing"
3. Click "Add to Chrome"
4. Confirm the installation

### Step 2: Verify Installation

1. Look for the Keploy icon in your Chrome toolbar
2. Click the icon to open the extension
3. You should see the Keploy dashboard

## Website 1: GitHub API Testing

### Target Website: GitHub.com

GitHub makes extensive API calls for repositories, user data, and search functionality.

### Testing Steps:

#### 1. Open GitHub

```bash
# Navigate to GitHub
https://github.com
```

#### 2. Start Recording

1. Click the Keploy extension icon
2. Click "Start Recording"
3. Select "GitHub API Testing" as the test name

#### 3. Perform API Interactions

**Search for Repositories:**

1. Use the search bar to search for "react"
2. Observe the API calls made to `/search/repositories`
3. Note the request parameters and response structure

**View User Profile:**

1. Click on a user's profile
2. Observe API calls to `/users/{username}`
3. Note the user data structure

**View Repository Details:**

1. Click on a repository
2. Observe API calls for repository data, README, etc.
3. Note the different endpoints being called

#### 4. Stop Recording

1. Click "Stop Recording" in the Keploy extension
2. Review the captured API interactions

#### 5. Analyze Results

- **Total API Calls**: 15-20 calls
- **Endpoints Tested**: Search, users, repositories, contents
- **HTTP Methods**: GET, POST
- **Response Types**: JSON, HTML

### Expected API Calls Captured:

```json
{
  "search_repositories": {
    "url": "https://api.github.com/search/repositories",
    "method": "GET",
    "params": {
      "q": "react",
      "sort": "stars",
      "order": "desc"
    },
    "response": {
      "total_count": 1234567,
      "items": [...]
    }
  },
  "user_profile": {
    "url": "https://api.github.com/users/{username}",
    "method": "GET",
    "response": {
      "login": "username",
      "id": 12345,
      "avatar_url": "...",
      "public_repos": 50
    }
  }
}
```

## Website 2: Weather API Testing

### Target Website: OpenWeatherMap or Weather.com

Weather websites make API calls to fetch current weather data and forecasts.

### Testing Steps:

#### 1. Open Weather Website

```bash
# Navigate to a weather website
https://openweathermap.org
# or
https://weather.com
```

#### 2. Start Recording

1. Click the Keploy extension icon
2. Click "Start Recording"
3. Select "Weather API Testing" as the test name

#### 3. Perform API Interactions

**Search for Location:**

1. Enter a city name (e.g., "New York")
2. Observe API calls to weather data endpoints
3. Note the location data structure

**View Current Weather:**

1. Click on current weather details
2. Observe API calls for current conditions
3. Note temperature, humidity, wind data

**View Forecast:**

1. Navigate to forecast section
2. Observe API calls for 5-day/7-day forecasts
3. Note the forecast data structure

#### 4. Stop Recording

1. Click "Stop Recording" in the Keploy extension
2. Review the captured API interactions

#### 5. Analyze Results

- **Total API Calls**: 8-12 calls
- **Endpoints Tested**: Current weather, forecast, geocoding
- **HTTP Methods**: GET
- **Response Types**: JSON

### Expected API Calls Captured:

```json
{
  "current_weather": {
    "url": "https://api.openweathermap.org/data/2.5/weather",
    "method": "GET",
    "params": {
      "q": "New York",
      "appid": "API_KEY",
      "units": "metric"
    },
    "response": {
      "main": {
        "temp": 20.5,
        "humidity": 65
      },
      "weather": [{
        "main": "Clouds",
        "description": "scattered clouds"
      }]
    }
  },
  "forecast": {
    "url": "https://api.openweathermap.org/data/2.5/forecast",
    "method": "GET",
    "params": {
      "q": "New York",
      "appid": "API_KEY"
    },
    "response": {
      "list": [...]
    }
  }
}
```

## Website 3: E-commerce API Testing

### Target Website: Amazon, eBay, or similar

E-commerce sites make extensive API calls for products, search, and user data.

### Testing Steps:

#### 1. Open E-commerce Website

```bash
# Navigate to an e-commerce site
https://amazon.com
# or
https://ebay.com
```

#### 2. Start Recording

1. Click the Keploy extension icon
2. Click "Start Recording"
3. Select "E-commerce API Testing" as the test name

#### 3. Perform API Interactions

**Search for Products:**

1. Use the search bar to search for "laptop"
2. Observe API calls for product search
3. Note the product listing structure

**View Product Details:**

1. Click on a product
2. Observe API calls for product details, reviews, pricing
3. Note the detailed product data structure

**Add to Cart:**

1. Try to add a product to cart
2. Observe API calls for cart management
3. Note the cart data structure

#### 4. Stop Recording

1. Click "Stop Recording" in the Keploy extension
2. Review the captured API interactions

## Analysis and Insights

### What Keploy Captured:

#### 1. **Request/Response Pairs**

- Complete HTTP requests with headers
- Full response bodies and status codes
- Query parameters and request bodies

#### 2. **Authentication Flows**

- Session tokens and cookies
- OAuth flows (if applicable)
- API key handling

#### 3. **Error Scenarios**

- 404 responses for invalid searches
- Rate limiting responses
- Network errors

#### 4. **Dynamic Data Handling**

- Timestamps and IDs
- User-specific data
- Real-time information

### Key Learnings:

#### 1. **API Complexity**

- Modern websites make 10-50 API calls per page
- Multiple endpoints for different features
- Complex authentication and session management

#### 2. **Data Relationships**

- APIs are interconnected
- One API call often triggers others
- Data flows between different endpoints

#### 3. **Error Handling**

- APIs handle various error scenarios
- Graceful degradation for failures
- User-friendly error messages

#### 4. **Performance Considerations**

- API response times vary significantly
- Caching strategies are evident
- Rate limiting is common

## Comparing Manual vs AI Testing

### Manual Testing Approach:

```javascript
// Traditional manual test for GitHub search
describe("GitHub Search API", () => {
  test("should search repositories", async () => {
    const response = await fetch("/search/repositories?q=react");
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.items).toBeDefined();
  });
});
```

**Time spent**: 30-60 minutes per website
**Coverage**: Limited to known endpoints
**Maintenance**: High - needs updates when APIs change

### AI Testing with Keploy:

```yaml
# Keploy automatically generates this from browser interactions
- name: "GitHub Search"
  request:
    method: "GET"
    url: "/search/repositories"
    params: { "q": "react" }
  response:
    status: 200
    body: '{"total_count": 1234567, "items": [...]}'
```

**Time spent**: 5-10 minutes per website
**Coverage**: All API interactions captured
**Maintenance**: Minimal - automatically adapts to changes

## Benefits of Chrome Extension Testing

### 1. **Real User Behavior**

- Captures actual user interactions
- Tests real-world scenarios
- Includes edge cases and errors

### 2. **Complete API Coverage**

- All API calls are captured
- No endpoints are missed
- Authentication flows included

### 3. **Zero Configuration**

- Works with any website
- No setup required
- Automatic detection of API calls

### 4. **Continuous Testing**

- Can run tests repeatedly
- Detects API changes automatically
- Maintains test coverage

## Best Practices

### 1. **Test Multiple Scenarios**

- Happy path (normal usage)
- Error scenarios (invalid inputs)
- Edge cases (empty results, rate limits)

### 2. **Document Your Findings**

- Note which APIs are called
- Document response structures
- Identify authentication methods

### 3. **Compare Results**

- Test the same functionality multiple times
- Compare responses for consistency
- Look for performance patterns

### 4. **Share Insights**

- Document your testing experience
- Share findings with your team
- Contribute to testing knowledge base

## Conclusion

Testing APIs with the Keploy Chrome extension provides several advantages:

1. **Speed**: 5-10 minutes vs 30-60 minutes
2. **Coverage**: 100% vs limited manual coverage
3. **Accuracy**: Real user behavior vs assumptions
4. **Maintenance**: Automatic vs manual updates

The Chrome extension approach is particularly valuable for:

- Understanding complex API interactions
- Testing third-party integrations
- Learning from real-world API usage
- Building comprehensive test suites

This experience demonstrates how AI-powered testing can revolutionize the way we approach API testing, making it faster, more comprehensive, and more accurate than traditional manual methods.

## Next Steps

1. **Publish your findings**: Write a blog post about your experience
2. **Share on social media**: Use the provided templates
3. **Apply to your own projects**: Use Keploy for your own API testing
4. **Contribute to the community**: Share your insights and learnings

---

**Resources:**

- [Keploy Documentation](https://docs.keploy.io)
- [Chrome Extension Guide](https://keploy.io/docs/chrome-extension)
- [API Testing Best Practices](https://keploy.io/blog/api-testing-best-practices)
