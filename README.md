# MMM-Intrusion-Detection
Intrusion detection module for Magic Mirror

### API Endpoints
1. Activate:
*http://magicmirrorip:8080/api/intrusion/activate*

2. Deactivate:
*http://magicmirrorip:8080/api/intrusion/deactivate*

3. Check if active:
*http://magicmirrorip:8080/api/intrusion/isactive*
```
//JSON response
{
  "active": true
}
```

### Hardware
1. PIR sensor
2. Red LED
3. 220 Ohm Resistor

### Circuit Diagram
![Image of Circuit](https://github.com/colton75/MMM-Intrusion-Detection/blob/master/images/IntrusionSystem_bb.jpg)
