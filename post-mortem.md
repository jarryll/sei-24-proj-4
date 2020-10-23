## Project Post Mortem

#### Approach and Process

* What in my process and approach to this project would I do differently next time?

When working with maps, it would be good for me to consider how to implement caching of resources to reduce load times when navigating the app. 
Also, instead of waiting till the end, I should have deployed a basic version of my app to Heroku so I can catch potential issues and address them earlier.

* What in my process and approach to this project went well that I would repeat next time?
Organising my app into the relevant folders helped to keep the structure neat and clean, which made it easier for me to debug and build on the existing functionalities


--

#### Code and Code Design

* What in my code and program design in the project would I do differently next time?

Map out the relationships between the various React components so as to better decide on the best design patterns to utilise. 
For this project, I ran into issues with passing props between components without a common ancestor and had to fall back on React's context API to solve the problem, which may not have been the most optimal tool to use.

```
function App() {
  return (
    <ViewportProvider>
      <PlacesProvider>
       <div className="App">
          <Router>
            <Switch>
              <ProtectedRoute exact path="/" component={Home} />
              <ProtectedRoute path="/dashboard" component={Dashboard} />
              <Route path="/login" component={SignIn} />
              <Route path="/register" component={SignUp} />
              <Route path="*" component={()=>"404 NOT FOUND"} />
          </Switch>
        </Router>
      </div>
      </PlacesProvider>
    </ViewportProvider>
  );
}
```
* What in my code and program design in the project went well? Is there anything I would do the same next time?

* Learning to use the spread operator and <code>event.target.id</code> to dynamically handle changes in form field states, instead of hard coding:

```
const handleLocationOnChange = (e) => {
        setAddLocation({
            ...addLocation,
            [e.target.id]: e.target.value
        })
        if (e.target.files) {
            const file = e.target.files[0]
            previewFile(file)
        }
    }
```
* Front end form validations to prevent unnecessary requests to the server:

```
const validate = () => {
    let hasError = false
    const errors = {
      firstName: null,
      firstNameError: "Required",
      lastName: null,
      lastNameError: "Required",
      email: null,
      emailError: "Invalid email address",
      password: null,
      passwordError: "Min 6 characters"
    }
    if (!fields.firstName || fields.firstName.length === 0) {
      hasError = true;
      errors.firstName = true
    }
    if (!fields.lastName || fields.lastName.length === 0) {
      hasError = true;
      errors.lastName = true
    }
    if (!fields.email || fields.email.indexOf('@') === -1) {
      hasError = true;
      errors.email = true;
    }
    if (!fields.password || fields.password.length < 6) {
      hasError = true;
      errors.password = true;
    }
    setError(errors)
    return hasError
  }
 ```

#### SEI Unit 4 Post Mortem
1. What habits did I use during SEI that helped me, that I will take on to my future coding projects?

* Writing throwaway code snippets to quickly understand how certain libraries/packages work
* Going through the documentation to learn the whys and hows of a piece of technology, and how to implement it into my project

2. What habits did I have during SEI I can improve on that I will try to change on future projects?

If a particular application I am developing is reliant on external APIs, it would be good for me to source for alternatives and try them out so I know the relative pros, cons and limitations of each before deciding which is most appropriate for the project's needs.

3. How is the overall level of the course overall? (instruction, course materials, etc.)

The course materials and projects equipped me with an understanding of the fundamentals of software engineering, and helped me know what I don't know enough of so I can brush up on those areas 

